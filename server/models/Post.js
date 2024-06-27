const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    body: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: String,
        default: Date.now
    },
    song:{
        type: String,
        required: false
    },
    topic:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Post', PostSchema);