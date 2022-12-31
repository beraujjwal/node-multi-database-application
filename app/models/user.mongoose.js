const mongoose = require('mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const MUser = new Schema ({
    _id: {
        type: String,
        auto: true,
        default: () => uuid.v4(),
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        index: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        index: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true, collection: 'users' });

module.exports = mongoose.model('MUser', MUser)