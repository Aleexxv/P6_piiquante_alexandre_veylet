const passwordValidator = require ('password-validator');

const schema = new passwordValidator();

schema
.is().min(6)
.is().max(40)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123', '123456', '123456789', 'qwerty', 'password', '123456', '1234567', '12345678', '12345', 'iloveyou', '111111', '123123', 'abc123', 'qwerty123', '1q2w3e4r', 'admin', 'qwertyuiop', '654321', '555555', 'welcome']); 



module.exports = (req, res, next ) => {
    if (schema.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({message: 'Mot de passe faible, utilisez au moins 6 caratères avec 2 chiffres et un caractère spécial, les espaces sont interdit. Veuillez saisir un nouveau mot de passe.'})}
}
