const CREATE_NEWS = `
	mutation CREATE_NEWS($categoryId: uuid, $content: String, $image: String, $originalLink: String, $tags: String, $title: String, $sourceId: uuid) {
		insert_links(objects: {category_id: $categoryId, content: $content, image: $image, original_link: $originalLink, source_id: $sourceId, tags: $tags, title: $title}) {
			returning {
				id
			}
		}
	}
`;

module.exports.CREATE_NEWS = CREATE_NEWS;
