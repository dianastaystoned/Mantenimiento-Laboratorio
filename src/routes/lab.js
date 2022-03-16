const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../lib/auth');

const pool = require('../database');

router.get('/add', isLoggedIn, isAdmin, (req, res) => {
    res.render('lab/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { codigo, edificio, nombre } = req.body;
    const newLab = { 
        codigo, 
        edificio,
        nombre
    };
    await pool.query('insert into laboratorio set ?', [newLab]);
    req.flash('success', 'Laboratorio guardado satisfactoriamente');
    res.redirect('/lab');
});

router.get('/', isLoggedIn, isAdmin, async (req, res) => {
    const lab = await pool.query('select * from laboratorio');
    res.render('lab/list', {lab});
});

router.get('/delete/:id', async (req, res) => {
   const { id } = req.params;
   await pool.query('delete from laboratorio where id = ?', [id]);
   req.flash('success','Laboratorio dado de baja');
   res.redirect('/lab');
});

router.get('/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    const lab = await pool.query('select * from laboratorio where id = ?', [id]);
    res.render('lab/edit', { lab: lab [0]});
});

router.post('/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { codigo, edificio, nombre } = req.body;
    const newLab = { 
        codigo,
        edificio,
        nombre
    };
    await pool.query('update laboratorio set ? where id = ?', [newLab, id]);
    req.flash('success', 'Información modificada satisfactoriamente');
    res.redirect('/lab');
})

//Listar computadoras
router.get('/computadora/:id', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    const comp = await pool.query('select * from computadora where lab_id = ?', [id]);
    const lab = await pool.query('select * from laboratorio where id = ?', [id]);
    res.render('lab/computadoras/list', {comp, lab:lab[0]});
});

router.get('/computadoras', isLoggedIn, isAdmin, async (req, res) => {
    const comp = await pool.query('select * from computadora');
    res.render('lab/computadoras/listall', {comp});
});

//Añadir computadoras
router.get('/addcompu/:id', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    const lab = await pool.query('select * from laboratorio where id = ?', [id]);
    res.render('lab/computadoras/addComputadora', {lab:lab[0]});
});

router.post('/addcompu/:id', isLoggedIn, isAdmin, async (req, res) => {
    const { codigo, marca, monitor, memoria, procesador, estatus, conexion } = req.body;
    const { id } = req.params;
    const newComp = { 
        codigo,
        marca,
        monitor,
        memoria,
        procesador,
        estatus,
        conexion,
        lab_id: id,
    };
    await pool.query('insert into computadora set ?', [newComp]);
    req.flash('success', 'Computadora añadida');
    res.redirect('/lab');
});

//Eliminar computadoras
router.get('/deletecomputer/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('delete from computadora where id = ?', [id]);
    req.flash('success','Computadora dado de baja');
    res.redirect('/lab/computadoras');
 });

//Editar computadoras
router.get('/editcompu/:id', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    const comp = await pool.query('select * from computadora where id = ?', [id]);
    const lab = await pool.query('select * from computadora where lab_id = ?', [id]);
    res.render('lab/computadoras/editComputadora', {lab, comp: comp [0]});
});

router.post('/editcompu/:id', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { codigo, marca, monitor, memoria, procesador, estatus, conexion } = req.body;
    const newComp = { 
        codigo,
        marca,
        monitor,
        memoria,
        procesador,
        estatus,
        conexion
    };
    await pool.query('update computadora set ? where id = ?', [newComp, id]);
    req.flash('success', 'Información modificada satisfactoriamente');
    res.redirect('/lab');
})

 //Listar mantenimientos
 router.get('/unkeep/:id', async (req, res) => {
    const { id } = req.params;
    const unkeep = await pool.query('select * from unkeep where comp_id = ?', [id]);
    const comp = await pool.query('select * from computadora where id = ?', [id]);
    res.render('lab/mantenimiento/list', {unkeep, comp:comp[0]});
});

//Añadir mantenimiento
router.get('/addunkeep/:id', async (req, res) => {
    const { id } = req.params;
    const comp = await pool.query('select * from computadora where id = ?', [id]);
    res.render('lab/mantenimiento/addMantenimiento', {comp:comp[0]});
});

router.post('/addunkeep/:id', async (req, res) => {
    const { tipo, descripcion } = req.body;
    const { id } = req.params;
    const newUnkeep = { 
        tipo,
        descripcion,
        comp_id: id
    };
    await pool.query('insert into unkeep set ?', [newUnkeep]);
    req.flash('success', 'Mantenimiento guardado');
    res.redirect('/lab');
});

 //Listar tickets
 router.get('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const ticket = await pool.query('select * from ticket where comp_id = ?', [id]);
    const comp = await pool.query('select * from computadora where id = ?', [id]);
    res.render('lab/tickets/list', {ticket, comp:comp[0]});
});


//Añadir tickets
router.get('/addticket/:id', async (req, res) => {
    const { id } = req.params;
    const comp = await pool.query('select * from computadora where id = ?', [id]);
    res.render('lab/tickets/addTicket', {comp:comp[0]});
});

router.post('/addticket/:id', async (req, res) => {
    const { estatus, fecha, problematica } = req.body;
    const { id } = req.params;
    const newTicket = { 
        estatus,
        fecha,
        problematica,
        comp_id: id,
        user_id: req.user.id  
    };
    await pool.query('insert into ticket set ?', [newTicket]);
    req.flash('success', 'Ticket guardado');
    res.redirect('/lab');
});

//Añadir usuarios
router.get('/adduser', isLoggedIn, isAdmin, (req, res) => {
    res.render('lab/auth/add');
});

router.post('/adduser', async (req, res) => {
    const { fullname, username, password } = req.body;
    const newUser = { 
        fullname, 
        username,
        password
    };
    await pool.query('insert into users set ?', [newUser]);
    req.flash('success', 'Usuario guardado satisfactoriamente');
    res.redirect('/lab/users');
});

//Listar usuarios
router.get('/users', isLoggedIn, isAdmin, async (req, res) => {
    const user = await pool.query('select * from users');
    res.render('lab/auth/list', {user});
});

//Eliminar usuarios
router.get('/deleteuser/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('delete from users where id = ?', [id]);
    req.flash('success','Usuario dado de baja');
    res.redirect('/lab/users');
 });

 //Soporte dashboard
 router.get('/soporte/dashboard', isLoggedIn, async (req, res) => {
    const comp = await pool.query('select * from computadora');
    res.render('lab/computadoras/listSoporte', {comp});
});
module.exports = router;