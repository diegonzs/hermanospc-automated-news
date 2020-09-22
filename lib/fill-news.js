const { categoryId } = require('./constants');

const getImageFromContent = (content) => {
	const words = content.split(' ');
	let filteredWords = words.filter(
		(w) => w.includes('.jpg') || w.includes('.png')
	);
	if (filteredWords.length) {
		let extension = filteredWords[0].includes('.jpg') ? '.jpg' : '.png';
		const rawImage = filteredWords[0];
		const firstIndex = rawImage.indexOf('https');
		const lastIndex = rawImage.indexOf(extension);
		const image = rawImage.slice(firstIndex, lastIndex + 4);
		return image;
	}
};

const getImage = (item) => {
	if (!item) {
		console.log('there is no item');
		return;
	}
	if (item.enclosure) {
		return item.enclosure.url;
	} else if (item['media:content']) {
		return item['media:content']['$'].url;
	} else if (item['content:encoded']) {
		return getImageFromContent(item['content:encoded']);
	} else if (item.content) {
		return getImageFromContent(item.content);
	}
};

const fillNews = ({ item, sources }) => {
	// Default Data
	const data = {
		image: '',
		tags: '[]',
		categoryId,
		sourceId: '',
		content: '',
	};

	// Get the source
	const source = sources.find((elem) => item.link.includes(elem.slug));

	/** Set source Id  */
	if (source) {
		data.sourceId = source.id;
	}

	/** Set image */
	const image = getImage(item);

	if (image) {
		data.image = image;
	}

	/** Set content */
	if (item['content:encoded']) {
		data.content = item['content:encoded'];
	} else if (item.content) {
		data.content = item.content;
	}

	/** Set Title */
	data.title = item.title;

	/** Set original Link */
	data.originalLink = item.link;

	/** Set tags */
	if (item.categories) {
		data.tags = JSON.stringify(item.categories);
	}

	return data;
};

module.exports.fillNews = fillNews;
