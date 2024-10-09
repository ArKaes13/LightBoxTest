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

    //Clicks the 'Job Search' link
    let jobSearch = await driver.findElement(By.xpath('//a[contains(text(), "Job Search")]'));
    jobSearch.click();

    //Waits for the new tab to open, grabs all tabs, and then switches to the new one
    await driver.sleep(1000);
    let tabs = await driver.getAllWindowHandles();
    await driver.switchTo().window(tabs[1]);

    //Waits for the apply link to appear and then clicks on it
    let apply = await driver.wait(until.elementLocated(By.xpath('//a[contains(text(), "Apply")]')), 20000);
    apply.click();

    //Finds the input fields/button, inputs login information, and logs in
    let email = await driver.wait(until.elementLocated(By.xpath('//input[@type="email"]')), 20000);
    await email.sendKeys('ArKaes1820@yahoo.com');
    let password = await driver.findElement(By.xpath('//input[@type="password"]'));
    await password.sendKeys('TestPassword1820!');
    let loginBtn = await driver.findElement(By.xpath('//button[@name="login"]'));
    await loginBtn.click();

    //Waits for the login to finish, finds the job search link, and clicks it.
    await driver.sleep(3000);
    let jobSearch2 = await driver.wait(until.elementLocated(By.xpath('//a[contains(text(), "Job Search")]')), 10000);
    await jobSearch2.click();

    //Waits for page to load, finds the applied jobs link, and clicks it.
    await driver.sleep(3000);
    let appliedJobs = await driver.wait(until.elementLocated(By.xpath('//a[contains(text(), "Applied Jobs")]')), 10000);
    appliedJobs.click();


    //Finds the job posting/status, slices the job title to be more reasonable, and logs the result
    await driver.sleep(3000);
    let job = await driver.findElement(By.xpath('//div[@class="posting-title"]/h2/a'))
    let jobTitle = await job.getText();
    let status = await driver.findElement(By.xpath('//div[@class="status"]/div'))
    let statusText = await status.getText();
    jobTitle = jobTitle.slice(33, jobTitle.length)
    console.log(`Tyler would be perfect for the role of '${jobTitle}' and was definitely not '${statusText}!`)

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
            console.error(`Test Failed: '${aboutUsLink}' is not a valid URL.`);
            console.error(`Axios error message: ${error.message}`);
    }

    // quits the test
    await driver.quit()
}

//Runs both tests
lightBoxCareer();
lightBoxAbout();