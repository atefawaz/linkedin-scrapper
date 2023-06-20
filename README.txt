------------------
Code Documentation
------------------
This code is a Node.js script that uses the Puppeteer and XLSX libraries to log in to LinkedIn, scrape post data from the user's feed, and export the data to an Excel file.

fs: A core Node.js module for file system operations.
puppeteer: A Node.js library for controlling a headless Chrome browser. It is used for automating web interactions.
xlsx: A library for reading, manipulating, and writing Excel files in Node.js.
Make sure to install these dependencies before running the code.

To run this code : 
1- npm init -y
2- npm i puppeteer
3- npm install xlsx
5- (Go to package.json change "test" to "start and write inside it "node {your_file_name(index.js)}" )
4- npm start

------------------------------------------------------------------------------------------------------------------------------------------------------------------
I created a log in function and i got access to chrome  : 

- It launches a headless chrome browser using puppeteer . 

- I navigated to the Linkedin sign-in page , wrote my email and password into the corresponding input fields and submit it . 

- I took screenshots everytime for debugging purposes (sometimes the webpage closes directly).

- Created a function " autoScroll " that will scroll to the buttom of the page to load more posts .

- I extracted the Titles,Content,Published dates and Links using CSS selectors.( If the LinkedIn page structure or CSS classes change, the code may need to be updated accordingly.)

- I created an array of post objects with the extracted data and saved the post data to an Excel file using the XLSX library.

-The Excel file is named "data.xlsx" and it is saved in the current working directory.

Finally, the code closes the browser and logs a message indicating that the data has been exported to the Excel file.

------------------------------------------------------------------------------------------------------------------------------------------------------------------

------------------
Additional notes :

------------------
- "autoScroll" : To load more content, this function scrolls to the bottom of the page. It employs page.evaluate To run JavaScript code within the context of the page.
- Use an async IIFE (immediately invoked function expression) to invoke the login function: The login method is encapsulated in an async IIFE so that it can run instantly and catch any execution-related issues.
- Address any execution-related errors: An error will be detected and logged to the console if it happens during the login process or any other phase.

- I tried to get the link of each post by clicking the threedots on the post and click on "copy link to post " , it worked only on the first post not more : 

(//   // Click on the three dots of the first post
//   const threeDots = await page.waitForSelector('div > .feed-shared-control-menu__trigger');
//   await threeDots.click();

// // TO CLICK ON THE COPY LINK TO POST BUTTON
//   async function clickCopyLinkToPostButton() {
//     const buttonSelector = '.feed-shared-control-menu__item.option-share-via';
  
//     await page.waitForSelector(buttonSelector); 
//     const copyLinkButton = await page.$(buttonSelector);
//     await copyLinkButton.click(); 
//   }
  
//   clickCopyLinkToPostButton();

//   // TO COPY THE LINK and paste it

//   const copiedLink = await page.evaluate(() => navigator.clipboard.readText());

//   console.log('Copied link:', copiedLink);)


