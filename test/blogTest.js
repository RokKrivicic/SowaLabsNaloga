const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Bison blog tests", function () {

    const driver = new Builder().forBrowser("chrome").build(); //create new object
    const tests = [
        { word: "BISON-inside"},
        { word: "Knowledge"},
        { word: "The World of Bitcoin"}
    ];
    // before each test
    this.beforeEach(async function () {
        await driver.get("https://bisonapp.com/"); //navigate to the page
        await driver.manage().window().fullscreen(); // fullscreen mode
        await driver.findElement(By.linkText("Blog")).click(); //find and click Blog
        try {
            await driver.findElement(By.xpath("//*[@id='cc-window']/div[5]/a[1]")).click(); // accept cookies
        }
        catch (e) {
            if (e.name === 'ElementNotInteractableError'); // ignore if there are no cookies
        }
    });
    // after all test close everything
    this.afterAll(async function () {
        driver.quit();
    });

    tests.forEach(({ word}) => { //use parameters
        it(`test click on ${word}`, async function () {
            await driver.wait(until.elementIsVisible(driver.findElement(By.linkText(word))), 5, "no element").click(); //wait for element to appear and click on it 
            const title_text = await driver.wait(until.elementIsVisible(driver.findElement(By.className("page-title ast-archive-title"))), 5, "no element").getText().then(function(value){
                return value;
            }) // get title when the page reloads
            assert.strictEqual(title_text, word, "something went wrong") //check if the title is the same as the word you click on 
        });
    });
});
