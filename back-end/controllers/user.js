const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User =  require('../models/User');

exports.signUp = (req, res, next) => {
    const saltRounds = 10;
    let password = req.body.password;
    let email = req.body.email;

        bcrypt.hash(password, saltRounds, (err, hash) => {
            const user = new User({
                email: email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch (message => res.status(400).json({ message : 'Email déja enregistrer !' }));
        })
    }


exports.logIn = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(400).json({ message: 'Mot de passe incorrect' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                )
            });
        })
        .catch (error => res.status(500).json({ error: error }));
    })
    .catch (error => res.status(500).json({ error: error }));
};
