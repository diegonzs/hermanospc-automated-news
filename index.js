require('dotenv').config();
const automatedNews = require('./automated-news');

(async () => {
	await automatedNews();
	process.exit();
})();

// setInterval(() => {
// 	automatedNews();
// }, 1800000);
