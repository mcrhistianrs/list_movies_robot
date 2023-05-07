const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const readline = require('readline');


function generateMoviesPDF(movies){
    const fs = require('fs');

    const doc = new PDFDocument();

    let y = 50;

    movies.forEach(line => {
        doc.text(line, 100, y);
        y += 20; //Nova linha
    });
    
    doc.pipe(fs.createWriteStream('/tmp/output.pdf'));
doc.end();

}

async function searchMovies(searchQuery) {
  const browser = await puppeteer.launch({
    headless:true
  });
  const page = await browser.newPage();

  
  await page.goto('https://www.rottentomatoes.com/search');

  await page.waitForSelector('.search-text');
  await page.type('.search-text', searchQuery);
  await page.keyboard.press('Enter');
  console.log('\tObtendo os filmes')
  await page.waitForNavigation();

  const movieTitles = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('#search-results > search-page-result:nth-child(3) > ul > *'));
    return titles.map(title => title.textContent.trim());
  });

  console.log('\tGerando o pdf com a lista de filmes')
  generateMoviesPDF(movieTitles)
  await browser.close();
  console.log('PDF salvo em /tmp/output.pdf')

}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question(`Diga o nome do filme\n`, (input) => {
    searchMovies(input);
    rl.close();
  });
