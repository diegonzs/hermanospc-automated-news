const { icon, badge } = require('./constants');

const sendNotification = async ({
	title,
	image,
	linkId,
	sourceSlug,
	firebaseAdmin,
	sourceName,
}) => {
	const message = {
		notification: {
			title,
			body: `By ${sourceName}`,
		},
		webpush: {
			fcm_options: {
				link: `news-detail/${linkId}`,
			},
			notification: {
				image,
				icon,
				badge,
			},
		},
		topic: sourceSlug,
	};

	try {
		const response = firebaseAdmin.messaging().send(message);
		if (response) {
			console.log('Successfully sent message:', response);
			return;
		}
	} catch (error) {
		console.log('Error sending message:', error);
		return;
	}
};

module.exports.sendNotification = sendNotification;
