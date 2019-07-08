
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx))return true;
    else return false;
};

//Validamos que no nulo ó vacio.
const isValid = (string) => {
    if(string.trim() === '')return true;
    else return false;
};

exports.validSignup = (data) => {
    let errors = {};
    //Validar Datos.
    // Validamos que el correo no venga vacio
    if(isValid(data.email)){
        errors.email = 'El Correo es Obligatorio';
        // Validamos que sea un correo usuario
    } else if(!isEmail(data.email)){
        errors.email = 'El Correo debe ser Valido';
    }
    //Que tenga un valor en la contraseña
    if(isValid(data.pass)) errors.pass = 'La contraseña es Obligatoria';
   
    if(isValid(data.handle)) errors.handle = 'El usuario es Obligatorio';
    //Si existe algun error retornamos el mensaje correspondiente.

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.validLogin = (data) => {
    let errors = {};
    if(isValid(data.email)) errors.email = 'El email es Obligatorio';
    if(!isEmail(data.email)) errors.email = 'El Correo debe ser Valido';
    if(isValid(data.pass)) errors.pass = 'La Contraseña es Obligatoria'; 
   
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};