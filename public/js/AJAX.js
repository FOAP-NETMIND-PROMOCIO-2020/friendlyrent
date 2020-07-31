/**
 * esto ase una llamada HTTP donde le digas y esto no permite modificar el Header de la petición, eso solo llamadas sencillas POST o GET que esta por defecto en GET 
 * @param {String} url la ruta a la que va hacer la llamada con o sin la query string
 * @param {object} elementMess "opcional" es un objeto html o un nodo HTML, al que quieres donde renderice o muestre la respuesta. OJO si "quieres"
 * @param {object} elementLoad "opcional" es un objeto html o un nodo HTML, al que quieres donde muestre que esta en espera. OJO si "quieres"
 * @param {String} location "opcional" si le pasas esto tienes qeu modificar el archivo AJAX.js en la funcion "showMessage", si vas a usar una ubicacion que ya esta definida tienes que ver que ver a donde va enviar la respuesta 
 * @param {String} request "opcional" solo si tienes que enviar una respuesta a una petición POST con forma de query string
 * @param {String} method "opcional" es el tipo de peticion que quieres hacer
 */
const AJAX = (url,elementMess,elementLoad,location,request,method='GET') => {

    const ajax = new XMLHttpRequest;//creo la clase para hacer peticiones

    ajax.open(method, url, true);// aqui le digo como va hacer

    if(method == 'POST'){
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    
    ajax.onreadystatechange = function(){
    
        if(this.status === 200 && this.readyState === 4){
            showMessage(this.responseText,elementMess,location)            
        }else if(this.readyState != 4) {
            loading(elementLoad)
        }else if(this.status != 200){
            this.onerror = onerror(this.status,elementMess);
        }
    }
    
    ajax.send(request)

}

/**
 * funcion que genera la imagen de carga
 * @param {object} element "opcional" es un objeto html o un nodo HTML, al que quieres donde renderice o muestre la respuesta. OJO si "quieres"
 */
const loading = (element) => {

    if(element){

        let img = document.createElement('IMG');
        img = document.createElement('IMG');
        img.classList.add('loadingAJAX');
        img.src= '/images/ajax_loader.png';
        let node = document.createElement('DIV');
        node.classList.add('loadingAJAX');
        node.appendChild(img);
        let p = document.createElement('P');
        p.textContent = 'loading AJAX...';
        p.style.textAlign = 'center';
        node.appendChild(p);
        element.appendChild(node);

    }

}


/**
 * muestra el estatus que debuelbe el servidor 
 * @param {string} err es el estatus que devuelve el servidor
 * @param {object} element "opcional" es un objeto html o un nodo HTML, al que quieres donde renderice o muestre la respuesta. OJO si "quieres"
 */
const onerror = (err,element) => {

    if(element){
        element.innerHTML = `<p style="font-size: 2em;"><b style="font-size: 2em; color: #f00;">¡¡Uuupss!!....</b></p><p style="font-size: 2em;text-indent: 3em;">¡Something went wrong. There was an error is the ${err}!</p>`;
    }
 
}

/**
 * esto solo muestra la información que devuelve el servidor
 * @param {String} message es la respuesta que da el servidor o la petición o llamada
 * @param {object} element "opcional" es un objeto html o un nodo HTML, al que quieres donde renderice o muestre la respuesta. OJO si "quieres"
 * @param {String} location "opcional" si le pasas esto tienes qeu modificar el archivo AJAX.js en la funcion "showMessage", si vas a usar una ubicacion que ya esta definida tienes que ver que ver a donde va enviar la respuesta 
 */
const showMessage = (message,element,location) => {

    switch (location) {
        case 'prueba':
                if (element) {
                    element.innerHTML = message;
                }
            break;

        case 'api ip':
                document.querySelector('input[type=hidden]#_DataUser').dataset.apiIp = message;
            break; 

        case 'Sign up':
                    document.querySelector('input[type=hidden]#_DataUser').dataset.userEmail = message;
            break;
    
        default:
                element.innerHTML = message;
            break;
    }
        
}