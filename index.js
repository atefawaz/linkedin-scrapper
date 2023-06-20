const fs = require('fs');

// to require puppeteer
const puppeteer = require('puppeteer');

// to require Excel
const XLSX = require('xlsx');

async function login() {
  const browser = await puppeteer.launch({ headless: false }); 
  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/checkpoint/lg/sign-in-another-account');

  // Enter the email
  await page.waitForSelector('#username');
  await page.type('#username', '#type_your_email_here');

  // Enter the password
  await page.waitForSelector('#password');
  await page.type('#password', '#type_your_password_here');

  // Click the login button
  await page.click('button[type="submit"]');

  // Wait for the navigation to complete
  await page.waitForNavigation();

  // Capture a screenshot of the webpage (for debugging purposes)
  await page.screenshot({ path: 'example.png', fullPage: true }); 

  // Scroll to the bottom of the page to load more posts
  await autoScroll(page);

  // Get the titles of each post
  const titles = await page.$$eval('.update-components-actor__title', elements =>
    elements.map(element => {
      return element.innerText;
    })
  );

  // Get the content of each post
  const postContent = await page.evaluate(() => {
    const posts = document.querySelectorAll('.feed-shared-update-v2__commentary');
    const contentArray = [];

    for (const post of posts) {
      const content = post.innerText.trim();
      contentArray.push(content);
    }

    return contentArray;
  });

  // Get the publication dates of each post
  const dateElements = await page.$$('.update-components-text-view.break-words span[aria-hidden="true"]');
  const dates = await Promise.all(dateElements.map(async (element) => {
    const date = await page.evaluate((el) => el.innerText, element);
    return date.trim();
  }));

  // Get the Profile URLs of each post
  const Links = await page.evaluate(() => {
    const postElements = document.querySelectorAll('.feed-shared-update-v2');
    const links = [];

    for (const postElement of postElements) {
      const linkElement = postElement.querySelector('a');

      if (linkElement) {
        const link = linkElement.href;
        links.push(link);
      }
    }

    return links;
  });

  // Create an array of post objects
  const posts = titles.map((title, i) => ({
    title,
    content: postContent[i],
    Published: dates[i],
    URLs: Links[i]
  }));

  // Create a new Excel workbook
  const workbook = XLSX.utils.book_new();

  // Convert the post objects to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(posts);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

  // Write the workbook to a buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  // Specify the filename for the Excel file
  const fileName = 'data.xlsx';

  // Write the buffer to the Excel file
  fs.writeFileSync(fileName, excelBuffer);

  console.log(`Data exported to ${fileName}`);

  // Close the browser
  await browser.close();
}

// Function to scroll to the bottom of the page
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// Main execution block
(async () => {
  try {
    await login();
  } catch (error) {
    console.error(error);
  }
})();
