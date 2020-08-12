const multer  = require('multer')

try {
    //Así se es la estructura y la definición de multer
    var storage = multer.diskStorage({
        /*
        En este momento cuando pasa por aquí tienes lo que te pasan del endpoint por eso tienes el mismo parámetro req y en file ya te viene los parámetros directamente uno por uno peor en req tienes todos en este punto, cd es una variable que usa multer
        */
        destination: function (req, file, cb) {
            //en el primer parámetro es si hay un erro por defecto para decirle que no se pone null, el segundo parámetro es la ruta de la carpeta tienes que crearla primero antes de pasarla aquí 
            cb(null, 'public/uploads/')
        },
        //aquí se defino el nombre y los parámetros de arriba pasa lo mismo aqui
        filename: function (req, file, cb) {
            //el segundo parámetro es el nombre del archivo que estas subiendo pero el por defecto no le pone la extensión tienes que colocársela tu y si no le pasas nada el pondrá un nombre aleatorio como el de id de mongoDB
            cb(null,`${file.fieldname}-${Date.now()}.${file.mimetype.match(/jpg|png|jpeg/)}`)
        }
    })
    
    //se crea un filtro, como en los casos de anteriores estos parámetros son iguales
    const fileFilter = (req, file, cb)=>{
        //creo la condición, aquí solo deja como bueno las extensiones jpg,png,jpeg 
        if (!file.mimetype.match(/jpg|png|jpeg/)) return cb(new Error('Error en el tipo de archivo. no es ni jpg, ni png y ni jpeg'));
        //Lo mismo que en los anteriores se le pasa null al primero y true al segundo para decirle que todo ha ido bien y continúe a salvarlos 
        cb(null, true);
    } 

    //en este punto se le inserta las opciones al multer
    var upload = multer({ storage: storage, fileFilter: fileFilter })

    //Aquí lo exporto y le aplico otra condición hay muchas ver la guía MULTER, se le pasa el nombre del campo donde va a recibir los archivos y la cantidad máxima
    exports.cpUpload = upload.fields([{ name: 'photo', maxCount: 4 },])

    //OJO si algo sale mal para abruptamente, si la condición del filtro da como que es otra extensión da un error de ejecución es su manera de decir que esto esta mal por ese motivo esto esta en un TryCatch

} catch (error) {
     throw new Error('Error en la subida')
}

//Para su uso solo se exporta esta fichero y se use pone en los endpoint que recibirán estos parámetros o mejor dicho archivos 


