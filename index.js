require('dotenv').config();
const automatedNews = require('./automated-news');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = async (req, res) => {
	await automatedNews();
	res.end('end');
};

// (async () => {
// 	await automatedNews();
// 	process.exit();
// })();

// setInterval(() => {
// 	automatedNews();
// }, 1800000);
