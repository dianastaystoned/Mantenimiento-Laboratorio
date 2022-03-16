CREATE DATABASE mantenimiento;
USE mantenimiento;

CREATE TABLE users(
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	fullname VARCHAR(50) NOT NULL,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(100) NOT NULL,
	fk_rol INT(10)
);

CREATE TABLE laboratorio(
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	codigo VARCHAR(30),
	edificio VARCHAR(10),
	nombre VARCHAR(100)
);

CREATE TABLE computadora(
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	lab_id INT(11),
	CONSTRAINT fk_lab FOREIGN KEY (lab_id) references laboratorio(id),
	codigo VARCHAR(30),
	marca VARCHAR(30),
	monitor VARCHAR(30),
	memoria VARCHAR(10),
	procesador VARCHAR(50),
	estatus VARCHAR(30), /*funcionando, reparación, baja*/
	conexion VARCHAR(30)
);

CREATE TABLE unkeep(
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	comp_id INT(11),
	CONSTRAINT fk_comp FOREIGN KEY (comp_id) references computadora(id),
	tipo VARCHAR(50), /*Preventivo, correctivo, interno, externo, etc.*/
	descripcion VARCHAR(300)
);

CREATE TABLE ticket(
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	estatus VARCHAR(50), /*abierto, proceso, cerrado.*/
	fecha VARCHAR(50),
	problematica VARCHAR(300),
	user_id INT(11),
	CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
	comp_id INT(11),
	CONSTRAINT fk_idcomp FOREIGN KEY (comp_id) references computadora(id)
);

SELECT * FROM laboratorio;