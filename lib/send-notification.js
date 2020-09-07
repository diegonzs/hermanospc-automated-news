const sendNotification = async ({
	title,
	image,
	linkId,
	sourceSlug,
	firebaseAdmin,
}) => {
	const message = {
		notification: {
			title,
		},
		webpush: {
			fcm_options: {
				link: `news-detail/${linkId}`,
			},
			notification: {
				image,
				icon: 'https://news.hermanospc.co/brand/hpc-pwa-icon.png',
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
