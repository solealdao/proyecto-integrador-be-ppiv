CREATE DATABASE IF NOT EXISTS clinic_system;
USE clinic_system;

-- Crear tabla de tipos de usuario
CREATE TABLE user_types (
  id_user_type INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Crear tabla de usuarios
CREATE TABLE users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  first_name CHAR(50) NOT NULL,
  last_name CHAR(50) NOT NULL,
  email CHAR(100) NOT NULL UNIQUE,
  password CHAR(100) NOT NULL,
  id_user_type INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (id_user_type) REFERENCES user_types(id_user_type)
);

-- Crear tabla de turnos
CREATE TABLE appointments (
  id_appointment INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status ENUM('confirmado', 'cancelado', 'completo', 'calificado') NOT NULL,
  id_patient INT NOT NULL,
  id_doctor INT NOT NULL,
  FOREIGN KEY (id_patient) REFERENCES users(id_user),
  FOREIGN KEY (id_doctor) REFERENCES users(id_user)
);

-- Crear tabla de historial de turnos
CREATE TABLE appointment_history (
  id_history INT AUTO_INCREMENT PRIMARY KEY,
  notes TEXT,
  id_appointment INT NOT NULL,
  FOREIGN KEY (id_appointment) REFERENCES appointments(id_appointment)
);

-- Crear tabla de mensajes
CREATE TABLE messages (
  id_message INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  sent_at DATETIME NOT NULL,
  id_sender INT NOT NULL,
  id_receiver INT NOT NULL,
  FOREIGN KEY (id_sender) REFERENCES users(id_user),
  FOREIGN KEY (id_receiver) REFERENCES users(id_user)
);

-- Crear tabla de encuestas de satisfacción
CREATE TABLE surveys (
  id_survey INT AUTO_INCREMENT PRIMARY KEY,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  submitted_at DATETIME NOT NULL,
  id_appointment INT NOT NULL,
  FOREIGN KEY (id_appointment) REFERENCES appointments(id_appointment)
);

-- Crear tabla de días de trabajo de los médicos
CREATE TABLE doctor_schedules (
  id_schedule INT AUTO_INCREMENT PRIMARY KEY,
  id_doctor INT NOT NULL,
  weekday ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  FOREIGN KEY (id_doctor) REFERENCES users(id_user)
);

-- Crear tabla de excepciones de día de trabajo de los médicos
CREATE TABLE doctor_exceptions (
  id_exception INT AUTO_INCREMENT PRIMARY KEY,
  id_doctor INT NOT NULL,
  exception_date DATE NOT NULL,
  reason VARCHAR(255),
  is_available BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (id_doctor) REFERENCES users(id_user)
);

