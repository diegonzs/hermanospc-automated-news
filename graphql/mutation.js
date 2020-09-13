const CREATE_NEWS = `
	mutation CREATE_NEWS($categoryId: uuid, $content: String, $image: String, $originalLink: String, $tags: String, $title: String, $sourceId: uuid, $cloudinaryId: String) {
		insert_links(objects: {category_id: $categoryId, content: $content, image: $image, original_link: $originalLink, source_id: $sourceId, tags: $tags, title: $title, cloudinary_id: $cloudinaryId }) {
			returning {
				id
				source {
					slug
					name
				}
			}
		}
	}
`;

const CREATE_ALL_NEWS = `
	mutation CREATE_ALL_NEWS($news: [links_insert_input!]!) {
		insert_links(objects: $news) {
			returning {
				links {
					id
				}
			}
		}
	}
`;

module.exports.CREATE_NEWS = CREATE_NEWS;
module.exports.CREATE_ALL_NEWS = CREATE_ALL_NEWS;
