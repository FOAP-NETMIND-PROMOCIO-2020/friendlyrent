
/**
 * 
 * @param {String} url 
 * @param {object} elementMess 
 * @param {object} elementLoad 
 * @param {String} location 
 * @param {String} request 
 * @param {String} method 
 */
const AJAX = (url,elementMess,elementLoad,location,request,method='GET') => {

    const ajax = new XMLHttpRequest;

    ajax.open(method, url, true);

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

const loading = (element) => {

    if(element){

    }

}

const onerror = (err,element) => {

    if(element){

    }
 
}

const showMessage = (message,element,location) => {
    console.log(location);
        switch (location) {
            case 'prueva':
                    if (element) {
                        element.innerHTML = message;
                    }
                break;

            case 'Sign up':
                        document.querySelector('input[type=hidden]#_DataUser').dataset.userEmail = message;
                break;
        
            default:
                    element.innerHTML = message;
                break;
        }
        
}