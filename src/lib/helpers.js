const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

helpers.redirectByUserRol = (rol)=>{
  if(rol == 1){
      return '/lab'
  }
  if(rol == 2){
      return 'lab/soporte/dashboard'
  }
}

module.exports = helpers;
