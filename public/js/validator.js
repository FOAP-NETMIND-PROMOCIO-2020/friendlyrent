let buttonHUITER = document.querySelector('form#signUp button');
let imput = document.querySelectorAll('form#signUp input')
AJAX('http://ip-api.com/json/',null,null,'api ip')
AJAX('/AJAX',null,null,'Sign up',null,'POST');

//valid that gmail is not repeated
const validatorSignUp = (x) => {

    let CSSinput = `padding-right: calc(1.5em + .75rem) !important;
    background-repeat: no-repeat !important;
    background-position: right calc(.375em + .1875rem) center !important;
    background-size: calc(.75em + .375rem) calc(.75em + .375rem) !important;`

    //console.log('hola');
    let User = document.querySelector('input[type=hidden]#_DataUser').dataset.userEmail;
    User = JSON.parse(User);
    let inputEmail = document.querySelector('form#signUp input[type=email]')
    
    if (x.target == inputEmail) {
        if(User.some(element => (element.local.email == inputEmail.value))) { 
            //console.log('si');
            inputEmail.style = CSSinput + `background-image: url(images/close.png) !important; border-color: #dc3545;`
            document.querySelector('form#signUp div#emailValid').style.display = 'block'
            buttonHUITER.disabled = true
        }else if(inputEmail.value != '') {
            //console.log('no');
            inputEmail.style = CSSinput //+ `background-image: url(images/check.png) !important; border-color: #28a745;`
            document.querySelector('form#signUp div#emailValid').style.display = 'none'
            buttonHUITER.disabled = false
        }
    } else {
        if (imput[3].value != imput[4].value){
            imput[4].style = CSSinput + `background-image: url(images/close.png) !important; border-color: #dc3545;`
            imput[3].style.borderColor = '#dc3545'
            document.querySelector('form#signUp div#passwordValid').style.display = 'block'
            buttonHUITER.disabled = true
        }else{
            imput[4].style = CSSinput + `border-color: none;`
            imput[3].style = ' border-color: none'
            document.querySelector('form#signUp div#passwordValid').style.display = 'none'
            buttonHUITER.disabled = false
        }
    }
   

}

let input = document.querySelector('form#signUp input[type=email]')
input.addEventListener('focusout',validatorSignUp);
let inputPass = document.querySelector('form#signUp input#password2')
inputPass.addEventListener('focusout',validatorSignUp);

const validatorSignUpSubmit = () => {

    console.log('hoa');
    let apiIP = document.querySelector('input[type=hidden]#_DataUser').dataset.apiIp;
    console.log(apiIP);
    apiIP = JSON.parse(apiIP);

    let select = document.querySelector('form#signUp select')
    const html = document.querySelector('#aj')
    let namImp = []//imput.map(element => element.name)
    imput.forEach(element => namImp.push(element.name))
    const nameImput = ['fullName','userCode','email','userPassword','password']

    if (nameImput.some(element => !(namImp.includes(element))) || select.name != 'identifUser' || !(select.value === 'owner' || select.value === 'customer')) {
        console.log('si'); 

        setTimeout(() => {
            document.querySelector('div.card.bg-light').style.display = 'none';
            document.querySelector('div#JAJAJA').style.display = 'block';
            document.querySelector('div#JAJAJA p#IP').innerHTML = apiIP.query;
            (coords.estatus)? myMap(coords) : myMap(apiIP);
        }, 100);

        return false;
    }

    if (imput[3].value != imput[4].value){
        imput[4].style = CSSinput + `background-image: url(images/close.png) !important; border-color: #dc3545;`
        imput[3].style.borderColor = '#dc3545'
        document.querySelector('form#signUp div#passwordValid').style.display = 'block'
        return false;
    }else{
        imput[4].style = CSSinput + `border-color: none;`
        imput[3].style = ' border-color: none'
        document.querySelector('form#signUp div#passwordValid').style.display = 'none'
    }
    
}

const myMap = (element) =>{

    let latitude = element.lat
    let longitude = element.lon

    let mymap = L.map('mapHack').setView([41.390205, 2.154007], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib21pcmFzIiwiYSI6ImNrY2N5Z2RseTA5aTkycG9hcGZiYzJrYmwifQ.aiWWPHaXoI48e8V_l-bkyg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);
   
    console.log(latitude + " " + longitude);
    if (latitude && longitude) {
        var marker = L.marker([latitude, longitude]).addTo(mymap);
        mymap.flyTo([latitude, longitude], 15);
    }

}

let coords = {}

if ("geolocation" in navigator){ //check geolocation available 
    //try to get user current location using getCurrentPosition() method
    navigator.geolocation.getCurrentPosition(function(position){ 
            console.log("Found your location nLat : "+position.coords.latitude+" nLang :"+ position.coords.longitude);
            
            coords.lat = position.coords.latitude;
            coords.lon = position.coords.longitude;
            coords.estatus = true

        });
}else{
    console.log("Browser doesn't support geolocation!");
    coords.estatus = false
}
