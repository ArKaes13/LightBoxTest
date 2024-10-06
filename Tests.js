const {By, Builder} = require('selenium-webdriver')

async function lightBoxTest() {
    const driver = await new Builder().forBrowser('firefox').build();
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

lightBoxTest();