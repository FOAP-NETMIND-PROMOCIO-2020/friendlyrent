const puppeteer = require('puppeteer');
const assert = require('assert');
const mongoose = require('mongoose');
const Apartment = require('../models/apartments').Apartment;
const mongodb_uri = require('../config/database').url;

let broser;
let page;
let connection;



beforeEach(async function () {
    this.timeout(12000);

    browser = await puppeteer.launch();
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('http://localhost:3000/', ['geolocation']);
    page = await browser.newPage();
    // connection = await mongoose.connect(mongodb_uri, {
    //     useNewUrlParser: true,
    // });
    console.log("inicio...");
})

describe('Hacer login, usuario correcto', () => {

    it('Poner las credenciales correctas de un usuario; inicia sessión de manera correcta.', async () => {

        //    en login.ejs evaluar valor de 'message' o del input "btn"
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });

        //    Escribir el mail
        const email = await page.$('form[action="/login"] #email');
        await email.type("lauratama84@gmail.com");

        //    Escribir password
        const password = await page.$('form[action="/login"] #password');
        await password.type("huiter123");

        await page.click('input.btn');
        const divEncontrado = await page.waitForSelector('section.hero-wrap');

        assert(divEncontrado);

    }).timeout(20000);

    it('Poner las credenciales incorrectas de un usuario; y ver que tras hacar clic en Submit, seguimos en la misma página de login', async () => {

        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });

        // Escribir el mail
        const email = await page.$('form[action="/login"] #email');
        await email.type("loquillo@gmail.com");

        // Escribir password
        const password = await page.$('form[action="/login"] #password');
        await password.type("huiter987");

        await page.click('input.btn');
        const divEncontrado = await page.waitForSelector('div.alert');

        assert(divEncontrado);

    }).timeout(40000);

    it('Crear un apartmento con valores "normales"; o adecuados, es decir, que pasen la validación. Ir al endpoint /new-apartment; rellenar todos los campos, y hacer clic en el botón de submit. Comprobar que trás hacer clic en dicho botón; estamos en la vista de detalle del apartamento (puedes usar algo del DOM, o mirar en que URL estamos)', async () => {

        let retraso = 0;

        // formulario de login, con usuario tipo propietario
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });

        // Escribir el mail
        const email = await page.$('form[action="/login"] #email');
        await email.type("b@bb.b");

        // Escribir password
        const password = await page.$('form[action="/login"] #password');
        await password.type("z");

        // clic en botón de formulario
        await page.click('input.btn');

        const espera = await page.waitForSelector('#maxPrice');

        //cambiar a página de altas de apartamentos
        await page.goto('http://localhost:3000/new-apartment', { waitUntil: 'networkidle2' });

        // llenar formulario con todos los datos básicos
        const title = await page.$('form[action="/new-apartment"] #title');
        await title.type("Ideal para parejas jovenes sin niños ni mascotas", { delay: retraso });

        const description = await page.$('form[action="/new-apartment"] #description');
        await description.type("Muy buenas vistas, cerca de la playa y buenos restaurantes", { delay: retraso });

        const terms = await page.$('form[action="/new-apartment"] #terms');
        await terms.type("No se admiten mascotas. No se puede fumar. Zona de descanso a partir de las 22h.", { delay: retraso });

        const rooms = await page.$('form[action="/new-apartment"] #rooms');
        await rooms.type("3");

        const bathrooms = await page.$('form[action="/new-apartment"] #bathrooms');
        await bathrooms.type("2");

        const squareMeters = await page.$('form[action="/new-apartment"] #squareMeters');
        await squareMeters.type("90");

        const city = await page.$('form[action="/new-apartment"] #city');
        await city.type("Barcelona", { delay: retraso });

        const province = await page.$('form[action="/new-apartment"] #province');
        await province.type("Barcelona", { delay: retraso });

        const address = await page.$('form[action="/new-apartment"] #address');
        await address.type("Avenida Diagonal, 645 3° 2a.", { delay: retraso });

        const services = await page.$('form[action="/new-apartment"] #services');
        await services.type("AC", { delay: retraso });

        const price = await page.$('form[action="/new-apartment"] #price');
        await price.type("1250");

        const durationMonths = await page.$('form[action="/new-apartment"] #durationMonths');
        await durationMonths.type("48");

        const mainPhoto = await page.$('form[action="/new-apartment"] #mainPhoto');
        await mainPhoto.type("Título para la foto 1", { delay: retraso });

        const titlePhoto2 = await page.$('form[action="/new-apartment"] #title-photo-2');
        await titlePhoto2.type("Título para la foto 2", { delay: retraso });

        const titlePhoto3 = await page.$('form[action="/new-apartment"] #title-photo-3');
        await titlePhoto3.type("Título para la foto 3", { delay: retraso });

        const titlePhoto4 = await page.$('form[action="/new-apartment"] #title-photo-4');
        await titlePhoto4.type("Título para la foto 4", { delay: retraso });

        const mainPhotoUrl = await page.$('form[action="/new-apartment"] #mainPhoto-url');
        await mainPhotoUrl.type("https://q-cf.bstatic.com/images/hotel/max1024x768/584/58400252.jpg", { delay: retraso });

        const photo2 = await page.$('form[action="/new-apartment"] #photo-2');
        await photo2.type("https://q-cf.bstatic.com/images/hotel/max1024x768/112/112082968.jpg", { delay: retraso });

        const photo3 = await page.$('form[action="/new-apartment"] #photo-3');
        await photo3.type("https://r-cf.bstatic.com/images/hotel/max1024x768/112/112082972.jpg", { delay: retraso });

        const photo4 = await page.$('form[action="/new-apartment"] #photo-4');
        await photo4.type("https://q-cf.bstatic.com/images/hotel/max1024x768/584/58400248.jpg", { delay: retraso });

        // envía clic del botón
        await page.click('input.btn');

        // espera a que se recarge la pantalla de detalle del apartamento
        await page.waitForSelector('h1.mb-3.bread');

        const url = page.url();

        // mira que la URL contenga la dirección de la pagina de detalle '/apartment/'
        assert(url.includes("/apartment/"));
        // debería eliminar el apartamento anyadido?? apartmentInserted._id ??

    }).timeout(40000);
});

describe('Apartments getAllAvailableApartmentsForBooking', () => {

    it('Si llamo a esta función; es verdad que todos los apartamentos que recupero estan libres para hacer un booking? Es decir, que NO tienen valor en idBooking y además no tiene valor el campo unsubscribeDate', async () => {

        let hayAlgunApartamentoBaja;

        await mongoose.connect("mongodb+srv://friendlyrent:8VnQsLJikYPC0C4G@cluster0.7mjts.mongodb.net/bookingsApartments", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 5000,
        })

        const lista = await Apartment.getAllAvailableApartmentsForBooking();

         hayAlgunApartamentoBaja = lista.some( (apartment) => {
            return ( (apartment.idBooking!='') || (apartment.unsubscribeUser!='') || (apartment.unsubscribeDate!=''));
        })

        assert(!hayAlgunApartamentoBaja);

    }).timeout(10000);

    after( () => {
        mongoose.connection.close();

    })

})

afterEach(async () => {
    await browser.close();
    console.log("fin...");
})