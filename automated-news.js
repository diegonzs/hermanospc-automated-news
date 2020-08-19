const { createApolloFetch } = require('apollo-fetch');
const Parser = require('rss-parser');
const moment = require('moment');
const { fillNews } = require('./lib/fill-news');

// Queries
const { GET_ALL_LINKS_SOURCES } = require('./graphql/queries');

//Mutations
const { CREATE_NEWS } = require('./graphql/mutation');

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

	while (flag) {
		const pubDate = moment(rssNewsItems[i].pubDate);

		if (rightNow.diff(pubDate) > 1800000) {
			flag = false;
		} else {
			const data = fillNews({
				item: rssNewsItems[i],
				sources: linksSources.data.links_sources,
			});

			fetch({ query: CREATE_NEWS, variables: data });
			i++;
		}
	}

	return;
};
