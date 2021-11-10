const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Bison filter tests", function () {

    const driver = new Builder().forBrowser("chrome").build(); //create new object
    const tests = [
        { word: "average"},
        { word: ""},
        { word: "123"}
    ];
    // before each test
    this.beforeEach(async function () {
        await driver.get("https://bisonapp.com/"); //navigate to the page
        await driver.manage().window().fullscreen(); // fullscreen mode
        await driver.findElement(By.linkText("FAQ")).click(); //find and click FAQ
        try {
            await driver.findElement(By.xpath("//*[@id='cc-window']/div[5]/a[1]")).click(); // accept cookies
        }
        catch (e) {
            if (e.name === 'ElementNotInteractableError'); // ignore if there are no cookies
        }
        await driver.manage().window().setRect({ width: 400, height: 832, x: 0, y: 0 }); //resize to mobile
    });
    // after all test close everything
    this.afterAll(async function () {
        driver.quit();
    });

    tests.forEach(({ word}) => { //use parameters
        it(`test search for word ${word}`, async function () {
            try {
                await driver.wait(until.elementIsVisible(driver.findElement(By.id("faq-search"))), 5, "no element").sendKeys(word); //wait for the search box to appear and send the word from the list
                await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("/html/body/div[1]/div[2]/div/div/main/article/div/div/div/div/section[2]/div/div/div/div/div/section[6]/div/div/div/div/div/div[2]/div/div/div[3]"))), 5, "no element").click() //wait for max 5 second to check if the element is present and click on it
            }
            catch (e) {
                if (e.name === 'TimeoutErrror');
            }
            const t = await driver.findElement(By.xpath("/html/body/div[1]/div[2]/div/div/main/article/div/div/div/div/section[2]/div/div/div/div/div/section[6]/div/div/div/div/div/div[2]/div/div/div[3]/div[2]")).getText(); //save the text of the fisrt paragraph displayed
            assert(t.includes(word), `${word} not included`); //check if the searched word is present in the paragraph
        });
    });
    it ("test clear button", async function(){
        await driver.wait(until.elementIsVisible(driver.findElement(By.id("faq-search"))), 5, "no element").sendKeys("test");
        await driver.findElement(By.className("fas fa-times")).click(); // click clear x button
        const text_in_box = await driver.findElement(By.id("faq-search")).getText().then(function(value){
            return value
        }); //get the text value from the search box
        assert.strictEqual(text_in_box,"", "button does not work"); //check if the box is empty
    });
});






