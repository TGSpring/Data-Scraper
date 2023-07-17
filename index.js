const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const PORT = 8000;

// ...

app.get('/', (req, res) => {
    const url = 'https://www.reuters.com/world/europe/';
    axios.get(url)
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
  
        // Find the HTML elements that contain the articles
        const articleElements = $('a[data-testid="Heading"]');
  
        // Create an array to store the article details
        const articles = [];
  
        // Loop through the article elements and extract the title and URL
        articleElements.each((index, element) => {
          const articleTitle = $(element).text().trim();
          let articleURL = $(element).attr('href');
  
          // Prepend the base URL if the URL is relative
          if (articleURL && !articleURL.startsWith('http')) {
            articleURL = `https://www.reuters.com${articleURL}`;
          }
  
          // Store the article details in the array
          articles.push({ title: articleTitle, url: articleURL });
        });
  
        // Output the array of articles to the terminal
        console.log('Articles:', articles);
  
        // Render the article titles and URLs on the web page
        const articleHTML = articles.map(article => `<p><a href="${article.url}">${article.title}</a></p>`).join('');
        res.send(`<h1>Articles</h1>${articleHTML}`);
      })
      .catch(error => {
        console.log(error);
        res.send('An error occurred while scraping the articles.');
      });
  });
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));