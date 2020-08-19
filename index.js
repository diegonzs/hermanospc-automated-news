require('dotenv').config();
const automatedNews = require('./automated-news');

setInterval(() => {
	automatedNews();
}, 1800000);
