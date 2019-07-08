
const firebase = require('firebase');
const config = require('./config');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://posts.firebaseio.com'
});

firebase.initializeApp(config);

const db = admin.firestore();

module.exports = {
    admin,
    db
}
