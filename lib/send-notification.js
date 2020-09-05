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
			headers: {
				image: `https://res.cloudinary.com/tribuagency/image/upload/f_auto,q_80,w_335/${image}`,
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
