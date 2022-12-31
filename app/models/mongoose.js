require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_DATABASE_CONNECTION_URL = process.env.MONGO_DATABASE_CONNECTION_URL;
//const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const url = `${MONGO_DATABASE_CONNECTION_URL}`;

mongoose.connect(url, {useNewUrlParser: true});
mongoose.set('debug', true);