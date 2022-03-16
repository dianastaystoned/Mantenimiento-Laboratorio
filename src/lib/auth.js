const helpers = require('./helpers');

module.exports = {
    isNotLoggedIn(req, res, next){
        if (!req.isAuthenticated) {
            return next();
        }
        return res.redirect('/signup')
    },
    isLoggedIn (req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('message','Inicia sesión para poder acceder.') 
        res.redirect('/signin')
    },
    isAdmin(req, res, next) {
        if(req.user.fk_rol === 1){
            return next();
        }
        req.flash('message', 'Solo los administradores tienen acceso a estos modulos')
        res.redirect(helpers.redirectByUserRol(req.user.fk_rol))
    },
};