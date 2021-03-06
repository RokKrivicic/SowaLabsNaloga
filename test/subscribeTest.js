const { Builder, By} = require("selenium-webdriver");
const assert = require("assert");

describe("Subscribe to newsletter tests", function () {

    const driver = new Builder().forBrowser("chrome").build(); //create new object
    const name = "Test";
    const email = "test@testing.com"

    // before each test
    this.beforeEach(async function () {
        await driver.get("https://bisonapp.com/"); //navigate to the page
        try {
            await driver.findElement(By.xpath("//*[@id='cc-window']/div[5]/a[1]")).click(); // accept cookies
        }
        catch (e) {
            if (e.name === 'ElementNotInteractableError'); // ignore if there are no cookies
        } // fullscreen mode
        await driver.manage().window().fullscreen();
    });
    // after all test close everything
    this.afterAll(async function () {
        driver.quit();
    });
    it(`test sucessfull subscribe`, async function () {
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)"); //move to the bottom of the page
        await driver.findElement(By.name("newsletter-name")).sendKeys(name); //locate and insert name
        await driver.findElement(By.name("newsletter-email")).sendKeys(email); //logate and insert email
        await driver.findElement(By.xpath("/html/body/div[1]/div[3]/div/section[1]/div/div/div/div/div/section/div/div/div[5]/div/div/div[2]/div/div/div/div/div/section/div/div/div/div/div/div/div/form/div[3]/label")).click();//find first checkbox
        const checkbox = await driver.findElement(By.xpath("//*[@id='newsletter-chk-2']"));
        await driver.executeScript("arguments[0].click()", checkbox);//find and click second checkbox
        await driver.findElement(By.xpath("/html/body/div[1]/div[3]/div/section[1]/div/div/div/div/div/section/div/div/div[5]/div/div/div[2]/div/div/div/div/div/section/div/div/div/div/div/div/div/form/div[5]/button")).click();//click subscribe
        const message = await driver.findElement(By.className("newsletter-message")).getText().then(function (value) {
            return value //find notification
        });
        assert.strictEqual(message, "Confimation email sent.", "Mail was not send") //check if the notification is correct
    });
});
