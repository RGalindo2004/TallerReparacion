-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.7.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para tallerreparacion
CREATE DATABASE IF NOT EXISTS `tallerreparacion` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `tallerreparacion`;

-- Volcando estructura para tabla tallerreparacion.asignacion_equipo
CREATE TABLE IF NOT EXISTS `asignacion_equipo` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_codigo` int(11) NOT NULL,
  `usuario_codigo` int(11) NOT NULL,
  `fecha_asignacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_finalizacion` datetime DEFAULT NULL,
  `estado` enum('ACTIVO','FINALIZADO') NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`codigo`),
  KEY `equipo_codigo` (`equipo_codigo`),
  KEY `usuario_codigo` (`usuario_codigo`),
  CONSTRAINT `asignacion_equipo_ibfk_1` FOREIGN KEY (`equipo_codigo`) REFERENCES `equipo` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `asignacion_equipo_ibfk_2` FOREIGN KEY (`usuario_codigo`) REFERENCES `usuario` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=474 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla tallerreparacion.asignacion_equipo: ~20 rows (aproximadamente)
INSERT INTO `asignacion_equipo` (`codigo`, `equipo_codigo`, `usuario_codigo`, `fecha_asignacion`, `fecha_finalizacion`, `estado`) VALUES
	(1, 18, 2, '2025-03-01 10:00:00', '2025-04-01 18:00:00', 'FINALIZADO'),
	(2, 19, 3, '2025-02-15 09:30:00', '2025-03-10 17:45:00', 'FINALIZADO'),
	(3, 20, 4, '2025-03-20 14:00:00', NULL, 'ACTIVO'),
	(4, 21, 5, '2025-03-18 11:00:00', '2025-03-25 16:30:00', 'FINALIZADO'),
	(5, 22, 6, '2025-03-10 12:00:00', NULL, 'ACTIVO'),
	(6, 23, 7, '2025-03-22 15:00:00', NULL, 'ACTIVO'),
	(7, 24, 8, '2025-03-17 13:30:00', NULL, 'ACTIVO'),
	(8, 25, 9, '2025-03-14 08:30:00', '2025-03-28 17:00:00', 'FINALIZADO'),
	(9, 26, 10, '2025-03-05 10:45:00', NULL, 'ACTIVO'),
	(10, 27, 2, '2025-03-12 09:00:00', NULL, 'ACTIVO'),
	(11, 28, 3, '2025-03-07 14:15:00', '2025-03-20 18:00:00', 'FINALIZADO'),
	(12, 29, 4, '2025-03-19 11:30:00', NULL, 'ACTIVO'),
	(13, 30, 5, '2025-03-25 16:00:00', NULL, 'ACTIVO'),
	(14, 31, 6, '2025-03-13 10:30:00', '2025-03-22 12:00:00', 'FINALIZADO'),
	(15, 32, 7, '2025-03-08 15:45:00', NULL, 'ACTIVO'),
	(16, 33, 8, '2025-03-06 13:00:00', '2025-03-18 14:00:00', 'FINALIZADO'),
	(17, 34, 9, '2025-03-11 10:00:00', NULL, 'ACTIVO'),
	(18, 35, 10, '2025-03-04 09:00:00', '2025-03-15 17:00:00', 'FINALIZADO'),
	(19, 36, 2, '2025-03-02 16:00:00', '2025-03-12 11:30:00', 'FINALIZADO'),
	(20, 37, 3, '2025-03-09 14:30:00', NULL, 'ACTIVO');

-- Volcando estructura para tabla tallerreparacion.equipo
CREATE TABLE IF NOT EXISTS `equipo` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `numero_serie` varchar(50) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('INGRESADO','DISPONIBLE','EN_REPARACION','DESCARTADO') NOT NULL DEFAULT 'INGRESADO',
  `tipo_equipo` varchar(30) NOT NULL,
  `usuario` int(11) NOT NULL,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `numero_serie` (`numero_serie`),
  KEY `fk_tipo_equipo` (`tipo_equipo`),
  KEY `fk_marca` (`marca`),
  KEY `fk_usuario` (`usuario`),
  CONSTRAINT `fk_marca` FOREIGN KEY (`marca`) REFERENCES `marca` (`nombre`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tipo_equipo` FOREIGN KEY (`tipo_equipo`) REFERENCES `tipo_equipo` (`nombre`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla tallerreparacion.equipo: ~20 rows (aproximadamente)
INSERT INTO `equipo` (`codigo`, `numero_serie`, `marca`, `modelo`, `descripcion`, `estado`, `tipo_equipo`, `usuario`) VALUES
	(18, 'SN1001', 'Sony', 'VAIO-X', 'Pantalla parpadea intermitentemente.', 'DISPONIBLE', 'Laptop', 2),
	(19, 'SN1002', 'Samsung', 'GalaxyBook', 'Batería no retiene carga.', 'EN_REPARACION', 'Laptop', 3),
	(20, 'SN1003', 'LG', 'Gram17', 'Puerto USB dañado.', 'INGRESADO', 'Laptop', 4),
	(21, 'SN1004', 'Panasonic', 'Toughbook', 'Problemas de arranque.', 'INGRESADO', 'Laptop', 5),
	(22, 'SN1005', 'Dell', 'XPS13', 'Sobrecalentamiento frecuente.', 'DESCARTADO', 'Laptop', 6),
	(23, 'SN1006', 'HP', 'Envy', 'Teclado con teclas no funcionales.', 'DISPONIBLE', 'Laptop', 7),
	(24, 'SN1007', 'Apple', 'MacBook Air', 'Trackpad no responde.', 'EN_REPARACION', 'Laptop', 8),
	(25, 'SN1008', 'Toshiba', 'Satellite', 'Ruido inusual del ventilador.', 'DISPONIBLE', 'Laptop', 9),
	(26, 'SN1009', 'Sharp', 'Aquos', 'Error al iniciar sistema operativo.', 'INGRESADO', 'Monitor', 10),
	(27, 'SN1010', 'Philips', 'Smartbook', 'Pantalla negra al encender.', 'DISPONIBLE', 'Laptop', 2),
	(28, 'SN1011', 'Lenovo', 'ThinkPad X1', 'Fallos de conexión Wi-Fi.', 'DISPONIBLE', 'Laptop', 3),
	(29, 'SN1012', 'Acer', 'Aspire 5', 'Sonido distorsionado por altavoces.', 'INGRESADO', 'Laptop', 4),
	(30, 'SN1013', 'Asus', 'ZenBook', 'Falla en la tarjeta gráfica.', 'DISPONIBLE', 'Laptop', 5),
	(31, 'SN1014', 'Microsoft', 'Surface Pro', 'Pantalla táctil sin respuesta.', 'DISPONIBLE', 'Tablet', 6),
	(32, 'SN1015', 'Xiaomi', 'Mi Notebook', 'No reconoce el disco duro.', 'DISPONIBLE', 'Laptop', 7),
	(33, 'SN1016', 'Huawei', 'MateBook X', 'Batería se descarga rápidamente.', 'INGRESADO', 'Laptop', 8),
	(34, 'SN1017', 'Google', 'Pixelbook', 'Reinicio aleatorio del sistema.', 'EN_REPARACION', 'Laptop', 9),
	(35, 'SN1018', 'MSI', 'GF63', 'Luces del teclado no funcionan.', 'DISPONIBLE', 'Laptop', 10),
	(36, 'SN1019', 'Alienware', 'M15', 'No detecta tarjeta gráfica dedicada.', 'DISPONIBLE', 'Laptop', 2),
	(37, 'SN1020', 'Razer', 'Blade Stealth', 'Puerto HDMI no funciona.', 'DISPONIBLE', 'Laptop', 3);

-- Volcando estructura para tabla tallerreparacion.marca
CREATE TABLE IF NOT EXISTS `marca` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla tallerreparacion.marca: ~20 rows (aproximadamente)
INSERT INTO `marca` (`codigo`, `nombre`) VALUES
	(22, 'Acer'),
	(29, 'Alienware'),
	(18, 'Apple'),
	(23, 'Asus'),
	(19, 'Dell'),
	(27, 'Google'),
	(20, 'HP'),
	(26, 'Huawei'),
	(21, 'Lenovo'),
	(13, 'LG'),
	(24, 'Microsoft'),
	(28, 'MSI'),
	(14, 'Panasonic'),
	(16, 'Philips'),
	(30, 'Razer'),
	(12, 'Samsung'),
	(15, 'Sharp'),
	(11, 'Sony'),
	(17, 'Toshiba'),
	(25, 'Xiaomi');

-- Volcando estructura para tabla tallerreparacion.tipo_equipo
CREATE TABLE IF NOT EXISTS `tipo_equipo` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla tallerreparacion.tipo_equipo: ~10 rows (aproximadamente)
INSERT INTO `tipo_equipo` (`codigo`, `nombre`) VALUES
	(12, 'All-in-One'),
	(13, 'Dispositivo Móvil'),
	(9, 'Impresora'),
	(6, 'Laptop'),
	(8, 'Monitor'),
	(11, 'PC Escritorio'),
	(14, 'Proyector'),
	(10, 'Servidor'),
	(15, 'Switch'),
	(7, 'Tablet');

-- Volcando estructura para tabla tallerreparacion.tipo_usuario
CREATE TABLE IF NOT EXISTS `tipo_usuario` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla tallerreparacion.tipo_usuario: ~4 rows (aproximadamente)
INSERT INTO `tipo_usuario` (`codigo`, `nombre`) VALUES
	(8, 'Administrador'),
	(7, 'Supervisor'),
	(6, 'Tecnico'),
	(5, 'Usuario_Final');

-- Volcando estructura para tabla tallerreparacion.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `correoelectronico` varchar(30) NOT NULL,
  `contrasena` varchar(250) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('M','F') NOT NULL,
  `estado` enum('ACT','INA') NOT NULL,
  `tipo` varchar(15) NOT NULL,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `tipo` (`tipo`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`tipo`) REFERENCES `tipo_usuario` (`nombre`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla tallerreparacion.usuario: ~11 rows (aproximadamente)
INSERT INTO `usuario` (`codigo`, `nombre`, `apellido`, `correoelectronico`, `contrasena`, `telefono`, `fecha_nacimiento`, `genero`, `estado`, `tipo`) VALUES
	(1, 'Admin', 'Admin', 'admin@admin.com', '$2b$10$2sZ2y.wJgOjUrW3fdsIMOeNPMu5sX3AVUYbvuUrLaLNGeggKGkQIW', '12345678', '1990-01-01', 'M', 'ACT', 'Administrador'),
	(2, 'Ramiro', 'Galindo', 'ramiro.galindo@gmail.com', '$2b$10$2B.3nnTg7ceDmHNs3kKX0uHYhVX/17qG5tFBk/i6WC0/CgnFrz9B.', '11111111', '1992-05-10', 'M', 'ACT', 'Supervisor'),
	(3, 'Jordy', 'Pineda', 'jordy.pineda@gmail.com', '$2b$10$kf9Gd..EuGz8iISzt6z3cu7w7I4C6j/Tr42QCYQXP0Klw2MavFbGW', '22222222', '1988-08-15', 'M', 'ACT', 'Tecnico'),
	(4, 'Jair', 'Calix', 'jair.calix@gmail.com', '$2b$10$.zOjsnMPd3tSY6tuqNWcv.l36wLOxj5uPFmTshQiaIG4RH5Em.XHa', '33333333', '1995-12-22', 'M', 'ACT', 'Supervisor'),
	(5, 'Esdras', 'Oseguera', 'esdras.oseguera@gmail.com', '$2b$10$aC8.3QAuY9RzRmpLTvq9mO8NR33HXFNRkeLH1yxkRyBBpW.czYwre', '44444444', '1991-03-18', 'M', 'ACT', 'Tecnico'),
	(6, 'Linda', 'Dimopoulos', 'linda.dimopoulos@gmail.com', '$2b$10$.QmdnWNc3EO2l9fqnOVYweQsuVVHRATvrqvE3vTfPTDCqdjg7rTEi', '55555555', '1994-11-05', 'F', 'ACT', 'Usuario_Final'),
	(7, 'Rocio', 'Alvarado', 'rocio.alvarado@gmail.com', '$2b$10$UA0Zpi1lZnzYhHdZcICrH.Mad9AeEKsgENEhGgn.fYLAD6o9fpvtu', '66666666', '1990-02-28', 'F', 'ACT', 'Tecnico'),
	(8, 'Valeria', 'Morales', 'valeria.morales@example.com', '12345', '77777777', '1987-07-17', 'F', 'INA', 'Tecnico'),
	(9, 'Andrés', 'Castro', 'andres.castro@example.com', '12345', '88888888', '1993-06-30', 'M', 'INA', 'Usuario_Final'),
	(10, 'María', 'Torres', 'maria.torres@example.com', '12345', '99999999', '1996-09-12', 'F', 'INA', 'Supervisor'),
	(11, 'Barbara', 'Diaz', 'barbara.diaz@gmail.com', '$2b$10$5ssl1gq8T0AluAKtf.anMuJisfAj7ODUTLtyyL9QpRLqG.3vFWuaG', '12345678', '2004-07-21', 'F', 'ACT', 'Usuario_Final');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
