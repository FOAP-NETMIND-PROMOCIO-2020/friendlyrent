const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({ headless: false });
    // const context = browser.defaultBrowserContext();
    // await context.overridePermissions('http://localhost:3000/login', ['geolocation']);

    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');

    const emailInput = await page.$('form[action="/login"] #email');
    await emailInput.type("lauratama84@gmail.com", { delay: 200 });

    const passwordInput = await page.$('form[action="/login"] #password');
    await passwordInput.type("huiter123", { delay: 200 });

    const submitButton = await page.$('input[type=submit]');
    await submitButton.click();

    let existeLogOut;
    try {
        await page.waitFor(5000);
        existeLogOut = await page.$eval('a[href="/profile"]', e => e.textContent);
    } catch (error) {
        console.error("No se ha podido hacer login!", error);
    }

    console.log("Contenido:", existeLogOut);
    await browser.disconnect();
})();