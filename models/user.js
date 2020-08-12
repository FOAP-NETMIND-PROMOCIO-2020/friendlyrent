const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const commentsSchema = new mongoose.Schema({
    _id: false,
    comment: String,
    user_id: {
        type: String,
        ref: 'user'
    },
    creationDate: String
})

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: false
    },
    userCode: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    identifUser: {
        type: String,
        required: false
    },
    unsubscribeUser: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    local: {
        email: String,
        password: String        
    },
    facebook: {
        email: String,
        password: String,
        id: String,
        token: String
    },
    twitter: {
        email: String,
        password: String,
        id: String,
        token: String
    },
    google: {
        email: String,
        password: String,
        id: String,
        token: String
    },
    comments: {
        type: [commentsSchema], // Array de objetos
        required: false
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.local.password); //compara la contraseña con la almacenada en la BBDD
}

userSchema.statics.writedMessages = async function (idOwner, idCustomer, comments) {
        const filter = { _id: idCustomer };
        let newComment = {
        comment : comments,
        user_id : idOwner,
        creationDate : new Date().toLocaleDateString()
    }

    const update = { $push:{comments:newComment} };

    console.log("que tiene update", update)

    let x = await this.updateOne(filter, update ).catch(err=>{
        console.log("Error", err)
    })
    
    console.log("grabado", x);    
}


module.exports = mongoose.model('user', userSchema, 'user');