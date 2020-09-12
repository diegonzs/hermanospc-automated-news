const { categoryId } = require('./constants');

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
	if (item.enclosure) {
		data.image = item.enclosure.url;
	} else {
		if (item['content:encoded']) {
			const endIndex = item['content:encoded'].indexOf('jpg');
			if (endIndex > -1) {
				const startIndex = item['content:encoded'].indexOf('<img src="');
				const srcImage = item['content:encoded'].slice(
					startIndex + 10,
					endIndex + 3
				);
				data.image = srcImage;
			}
		}
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
