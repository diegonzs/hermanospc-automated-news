const GET_ALL_LINKS_SOURCES = `
	query GET_ALL_LINKS {
		links_sources {
			id
			slug
			name
			rss_link
		}
	}
`;

module.exports.GET_ALL_LINKS_SOURCES = GET_ALL_LINKS_SOURCES;
