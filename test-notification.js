require('dotenv').config();
const admin = require('firebase-admin');

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

var topicName = 'muycomputer';

var message = {
	notification: {
		title: 'Breaking news.... MULAN',
	},
	webpush: {
		fcm_options: {
			link: 'news-detail/8417c834-412c-4f7a-8547-b3a182d34774',
		},
		notification: {
			image:
				'https://res.cloudinary.com/tribuagency/image/upload/f_auto,q_80,w_335/news/jr3uv7tj7sfva910hern',
			icon: 'https://news.hermanospc.co/brand/maskable-icon-RGB.png',
			badge: 'https://news.hermanospc.co/brand/badge-alpha-2.png',
		},
		headers: {
			image:
				'https://res.cloudinary.com/tribuagency/image/upload/f_auto,q_80,w_335/news/jr3uv7tj7sfva910hern',
		},
	},
	topic: topicName,
};

admin
	.messaging()
	.send(message)
	.then((response) => {
		// Response is a message ID string.
		console.log('Successfully sent message:', response);
		return;
	})
	.catch((error) => {
		console.log('Error sending message:', error);
		return;
	});
