const express = require('express');
const pool = require('../database');

const router = express.Router();

//Así se mandan llamar todos los proyectos
router.get('/', async (req, res) => {
    const lab = await pool.query('select * from laboratorio');
    res.render('index', {lab});
});


module.exports = router;