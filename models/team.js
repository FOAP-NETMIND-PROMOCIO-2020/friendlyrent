
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({

    name: {
        name: String,
        // required: true
    },
    urlImg: {
        type: String,
        // required: true
    },
    urlGit: {
        type: String,
        // required: true
    },
    urlLinkedIn: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required: true
    }
   
})

module.exports = mongoose.model('team', teamSchema, 'team');
