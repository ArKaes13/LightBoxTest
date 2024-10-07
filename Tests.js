const {By, Builder, until} = require('selenium-webdriver')
const axios = require('axios');

async function lightBoxCareer() {
    let driver = await new Builder().forBrowser('firefox').build();
    await driver.get('https://www.lightboxre.com/');

    //Clicks on 'about' section and then clicks on 'careers' section
    let about = await driver.findElement(By.xpath('//li[@id="menu-item-5"]'));
    await about.click();
    let career = await driver.findElement(By.xpath('//li[@id="menu-item-5"]/ul/li[6]'));
    await career.click();

    //Switches into the iframe
    driver.switchTo().frame(0);

    //Finds the job posting, slices the job title to be more reasonable, and logs the result
    let job = await driver.findElement(By.xpath('//body/div/div/div/main/div[3]/ul/li[2]/div/div/div/h2/a'))
    let jobTitle = await job.getText();
    jobTitle = jobTitle.slice(33, jobTitle.length)
    console.log(`Tyler would be perfect for the role of '${jobTitle}'!`)

    //quits the test
    await driver.quit()
}

async function lightBoxAbout() {
    let driver = await new Builder().forBrowser('firefox').build();
    await driver.get('https://www.lightboxre.com/');

    //Clicks on 'about' section and then clicks on 'careers' section
    let about = await driver.findElement(By.xpath('//li[@id="menu-item-5"]'));
    await about.click();
    let career = await driver.findElement(By.xpath('//li[@id="menu-item-5"]/ul/li[6]'));
    await career.click();

    //Saves our current window id
    let originalWindow = await driver.getWindowHandle();

    //Switches into the iframe
    driver.switchTo().frame(0);

    //Clicks the 'Job Search' link
    let jobSearch = await driver.findElement(By.xpath('//a[contains(text(), "Job Search")]'));
    jobSearch.click();

    // Loop through until we find a new window handle and switch to that new window
    let windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
        if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
        }
    });

    //Locates the about us link and stores its href.
    let aboutUs = await driver.findElement(By.xpath('//a[contains(text(), "About Us")]'))
    let aboutUsLink = await aboutUs.getAttribute('href')

    //Checks the link and returns the http status code.
    try {
        let response = await axios.get(aboutUsLink);
        if (response.status == 200) {
            console.log(`Test Passed: '${aboutUsLink}' was fulfilled.`);
            console.log(`Http Status Code: ${response.status}`);
        } else {
            console.error(`Test Failed: '${aboutUsLink}' was unfulfilled.`);
            console.error(`Http Status Code: ${response.status}`);
        }
    } catch (error) {
            console.error(`'${aboutUsLink}' is not a valid URL.`);
            console.error(`Axios error message: ${error.message}`);
    }

    // quits the test
    await driver.quit()
}

//Runs both tests
lightBoxCareer();
lightBoxAbout();