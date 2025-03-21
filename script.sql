CREATE DATABASE IF NOT EXISTS tallerreparacion;

USE tallerreparacion;

CREATE TABLE tipo_usuario (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE usuario (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    correoelectronico VARCHAR(30) NOT NULL,
    contrasena VARCHAR(30) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero ENUM('M', 'F') NOT NULL,
    estado ENUM('ACT', 'INA') NOT NULL,
    tipo VARCHAR(15) NOT NULL,
    
    FOREIGN KEY (tipo) REFERENCES tipo_usuario(nombre) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO tipo_usuario (codigo, nombre) VALUES 
(1, 'Cliente'),
(2, 'Tecnico'),
(3, 'Supervisor'),
(4, 'Administrador');