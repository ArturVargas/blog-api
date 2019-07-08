const firebase = require('firebase');
const { db } = require('../firebase/admin');

const { validSignup, validLogin } = require('../validations/validators');

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        pass: req.body.pass,
        handle: req.body.handle,
        country: req.body.country
    };
    const { valid, errors } = validSignup(newUser);
    if(!valid) return res.status(400).json(errors);

    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'El nombre de usuario ya esta en Uso' });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.pass);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                country: newUser.country,
                createdAt: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ status: 'Ok', token });
        })
        .catch(err => {
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Este email ya esta en Uso' });
            }
            return res.status(500).json({ message: `Ocurrio un Error: ${err}` });
        })
};

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        pass: req.body.pass
    };
    const { valid, errors } = validLogin(user);
    if(!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.pass)
        .then( data => {
            return data.user.getIdToken();
        })
        .then( token => {
            return res.json({message:'Bienvenido', token});
        })
        .catch( err => {
            if(err.code === 'auth/wrong-password'){
                return res.status(403).json({message: 'Usuario ó Contraseña incorrectos'});
            }
            return res.status(500).json({error: `Ocurrio un Error: ${err}`});
        })
};

exports.getAuthUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if(doc.exists){
                userData.credentials = doc.data();
            }
            return res.json(userData);
        })
        .catch( err => {
            return res.status(500).json({error: `Ocurrio un Error: ${err}`});
        })
};