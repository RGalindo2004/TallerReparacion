CREATE DATABASE IF NOT EXISTS tallerreparacion;

USE tallerreparacion;

CREATE TABLE tipo_usuario (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE usuario (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    apellido VARCHAR(30) NOT NULL,
    correoelectronico VARCHAR(30) NOT NULL,
    contrasena VARCHAR(250) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero ENUM('M', 'F') NOT NULL,
    estado ENUM('ACT', 'INA') NOT NULL,
    tipo VARCHAR(15) NOT NULL,
    
    FOREIGN KEY (tipo) REFERENCES tipo_usuario(nombre) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO tipo_usuario (codigo, nombre) VALUES 
(1, 'Usuario_Final'),
(2, 'Tecnico'),
(3, 'Supervisor'),
(4, 'Administrador');

INSERT INTO usuario (codigo, nombre, apellido, correoelectronico, contrasena, telefono, fecha_nacimiento, genero, estado, tipo) 
VALUES (1, 'Admin', 'Admin', 'admin@admin.com', '$2b$10$IzngbmansZx8M7RXBAZFsum3WwKmETv2i7c7eZw/rixI7ylf2sxdG', '12345678', '1990-01-01', 'M', 'ACT', 'Administrador'); -- Contraseña: password

CREATE TABLE tipo_equipo (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE marca (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE equipo (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    numero_serie VARCHAR(50) NOT NULL UNIQUE,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    estado ENUM('INGRESADO', 'DISPONIBLE', 'EN_REPARACION', 'DESCARTADO') NOT NULL DEFAULT 'INGRESADO',
    tipo_equipo VARCHAR(30) NOT NULL,
    usuario INT NOT NULL,
    
    CONSTRAINT fk_tipo_equipo FOREIGN KEY (tipo_equipo) REFERENCES tipo_equipo(nombre) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_marca FOREIGN KEY (marca) REFERENCES marca(nombre) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario) REFERENCES usuario(codigo) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO tipo_equipo (codigo, nombre) VALUES 
(1, 'Laptop'),
(2, 'Desktop'),
(3, 'Impresora'),
(4, 'Celular'),
(5, 'Tablet');

INSERT INTO marca (nombre) VALUES
('Sony'),
('Samsung'),
('LG'),
('Panasonic'),
('Sharp'),
('Philips'),
('Toshiba'),
('Apple'),
('Dell'),
('HP');

CREATE TABLE asignacion_equipo (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    equipo_codigo INT NOT NULL,
    usuario_codigo INT NOT NULL,
    fecha_asignacion DATETIME NOT NULL DEFAULT NOW(),
    fecha_finalizacion DATETIME NULL,
    estado ENUM('ACTIVO', 'FINALIZADO') NOT NULL DEFAULT 'ACTIVO',

    FOREIGN KEY (equipo_codigo) REFERENCES equipo(codigo) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (usuario_codigo) REFERENCES usuario(codigo) ON DELETE CASCADE ON UPDATE CASCADE
);

