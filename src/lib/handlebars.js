const exhbs = require('express-handlebars')
const connection = require('../database')

let hbs = exhbs.create({})

hbs.handlebars.registerHelper('renderPrivileges',(rol)=>{
    if(rol === 1){
        return 'Administrador'
    }
    if(rol === 2){
        return 'Soporte'
    }
})