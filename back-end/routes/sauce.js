const express = require('express');
const router = express.Router();

const auth = require('../midd/auth');
const multer = require('../midd/multer-config');
const sauceCtrl = require('../controllers/sauce');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, multer, sauceCtrl.getAllSauce);
router.get('/:id', auth, multer, sauceCtrl.getOneSauce);
router.put('/:id', auth , multer, sauceCtrl.modifySauce);
router.delete('/:id', auth , multer, sauceCtrl.deleteSauce);
router.post('/:id/like', auth , sauceCtrl.likeSauce);

module.exports = router;