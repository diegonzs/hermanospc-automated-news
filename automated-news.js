const { createApolloFetch } = require('apollo-fetch');
const cloudinary = require('cloudinary').v2;
const Parser = require('rss-parser');
const moment = require('moment');
const { fillNews } = require('./lib/fill-news');
const admin = require('firebase-admin');
const { sendNotification } = require('./lib/send-notification');

// Queries
const { GET_ALL_LINKS_SOURCES } = require('./graphql/queries');

//Mutations
const { CREATE_NEWS } = require('./graphql/mutation');

// Cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Firebase Admin config
admin.initializeApp({
	credential: admin.credential.cert({
		type: process.env.FIREBASE_TYPE,
		project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
		private_key: process.env.FIREBASE_PRIVATE_KEY,
		client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
		client_id: process.env.FIREBASE_CLIENT_ID,
		auth_uri: process.env.FIREBASE_AUTH_URI,
		token_uri: process.env.FIREBASE_TOKEN_URI,
		auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
		client_x509_cert_url: process.env.CLIEN_X509_CERT_URL,
	}),
});

module.exports = async () => {
	const parser = new Parser();
	const rssNews = [];
	let rssNewsItems = [];
	const rightNow = moment();

	const fetch = createApolloFetch({
		uri: 'https://hasura.hermanospc.co/v1/graphql',
	});

	fetch.use(({ request, options }, next) => {
		if (!options.headers) {
			options.headers = {}; // Create the headers object if needed.
		}
		options.headers['x-hasura-admin-secret'] = process.env.HASURA_ADMIN_KEY;
		next();
	});

	const linksSources = await fetch({ query: GET_ALL_LINKS_SOURCES });

	for (const source of linksSources.data.links_sources) {
		const news = await parser.parseURL(source.rss_link);
		rssNews.push(news);
	}

	rssNews.forEach((source) => {
		rssNewsItems.push(...source.items);
	});

	rssNewsItems.sort(function (a, b) {
		return new Date(b.pubDate) - new Date(a.pubDate);
	});

	let flag = true;
	let i = 0;

	// console.log('se comenzaran a crear las noticias');

	while (flag) {
		const pubDate = moment(rssNewsItems[i].pubDate);

		if (rightNow.diff(pubDate) > 600000) {
			flag = false;
		} else {
			const data = fillNews({
				item: rssNewsItems[i],
				sources: linksSources.data.links_sources,
			});
			if (data.image) {
				const cloudinaryResponse = await cloudinary.uploader.upload(
					data.image,
					{
						folder: 'news',
					}
				);
				data.image = cloudinaryResponse.secure_url;
				data.cloudinaryId = cloudinaryResponse.public_id;
			}
			// allNews.push(data);
			const linkResponse = await fetch({ query: CREATE_NEWS, variables: data });
			await sendNotification({
				firebaseAdmin: admin,
				title: data.title,
				image: data.cloudinary_id ? data.cloudinaryId : data.image,
				linkId: linkResponse.data.insert_links.returning[0].id,
				sourceSlug: linkResponse.data.insert_links.returning[0].source.slug,
			});
			i++;
		}
	}

	// console.log(`ya se crearon todas las noticias. En total ${i}`);

	return;
};
