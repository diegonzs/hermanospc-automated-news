require('dotenv').config();
const automatedNews = require('./automated-news');

automatedNews();

process.exit();

// setInterval(() => {
// 	automatedNews();
// }, 1800000);
