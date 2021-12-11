const Sauce =  require('../models/Sauce');
const Like =  require('../models/Like');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/assets/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json(console.log('Sauce créée !')))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = async (req, res, next) => {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    const userId = req.body.userId;
    const resLike = req.body.like;

    // Like
    if (resLike === 1) {
        if (!sauce.usersLiked.includes(userId)) {
            const like = new Like({
                userId: userId,
                like: resLike
            });
            like.save();
            sauce.usersLiked.push(userId);
            sauce.likes += 1;
            await sauce.save();
            res.status(201).json({ message: 'like ok' });
        } else {
            Like.findOne({ userId: userId });
            res.status(400).json({ error: 'like déjà présent' });
        }
    } else if (resLike === 0) {
        if (sauce.usersLiked.includes(userId)) {
            const like = await Like.findOne({ userId: userId });
            like.deleteOne({ userId: userId })
            sauce.usersLiked.splice(userId, 1);
            sauce.likes += -1;
            await sauce.save();
            res.status(200).json({ message: 'like retirer' });
        }
    }


    // Dislike
    if (resLike === -1) {
        if (!sauce.usersDisliked.includes(userId)) {
            const like = new Like({
                userId: userId,
                like: resLike
            });
            like.save();
            sauce.usersDisliked.push(userId);
            sauce.dislikes += 1;
            await sauce.save();
            res.status(200).json({ message: 'dislike ok' });
        } else {
            Like.findOne({ userId: userId });
            res.status(400).json({ error: 'dislike déjà présent' });
        }
    } else if (resLike === 0) {
        if (sauce.usersDisliked.includes(userId)) {
            const dislike = await Like.findOne({ userId: userId });
            dislike.deleteOne({ userId: userId })
            sauce.usersDisliked.splice(userId, 1);
            sauce.dislikes += -1;
            await sauce.save();
            res.status(200).json({ message: 'dislike retirer' });
        }
    }
};

exports.getAllSauce = async (req, res, next) => {
    try{
        const sauce = await Sauce.find();
        return res.status(200).json(sauce);
    } catch (error) {
    return res.status(400).json({ error });
    };
};

exports.getOneSauce = async (req, res, next) => {
    try{
        const sauce = await Sauce.findOne({ _id: req.params.id });
        return res.status(200).json(sauce);
    } catch (error) {
    return res.status(400).json({ error });
    };
};

exports.modifySauce = async (req, res, next) => {
    const sauceModifyObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/assets/${req.file.filename}`
    } : { ...req.body };
    try{
        const updateSauce = await Sauce.updateOne({ _id: req.params.id }, { ...sauceModifyObject, _id: req.params.id });
        res.status(200).json(updateSauce);
    } catch (error) {
    return res.status(400).json({ error });
    };
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then (sauce =>{
        const filename = sauce.imageUrl.split('/assets/')[1];
        fs.unlink(`assets/${filename}`, () => {
            Sauce.deleteOne({  _id: req.params.id })
            .then(() => res.status(200).json({ error: 'Objet supprimé !' }))
            .catch(error => res.status(500).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};
