USE clinic_system;
-- 1. Tipos de usuario
INSERT INTO user_types (name) VALUES
('Paciente'),
('Doctor'),
('Administrador');

-- 2. Usuarios
-- a) Doctores
INSERT INTO users (first_name, last_name, email, password, id_user_type, is_active) VALUES
('Valeria', 'Morales', 'valeria.morales@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE),
('Esteban', 'Ríos', 'esteban.rios@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE),
('Julia', 'Fernández', 'julia.fernandez@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE),
('Martín', 'Silva', 'martin.silva@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE),
('Elena', 'Castro', 'elena.castro@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE),
('Diego', 'Romero', 'diego.romero@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE),
('Marina', 'Ruiz', 'marina.ruiz@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE),
('Federico', 'Acosta', 'federico.acosta@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE),
('Gabriela', 'Ortega', 'gabriela.ortega@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE),
('Sebastián', 'Delgado', 'sebastian.delgado@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE);

-- b. Administradores
INSERT INTO users (first_name, last_name, email, password, id_user_type, is_active) VALUES
('Laura', 'Benítez', 'laura.benitez@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 3, TRUE),
('Tomás', 'Ibarra', 'tomas.ibarra@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 3, TRUE),
('Paula', 'Reyes', 'paula.reyes@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 3, TRUE);

-- c. Pacientes
INSERT INTO users (first_name, last_name, email, password, id_user_type, is_active) VALUES
('Juan', 'Pérez', 'juan.perez@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 1, TRUE),
('María', 'López', 'maria.lopez@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 1, TRUE);

-- 3. Turnos (Appointments)
INSERT INTO appointments (date, time, status, id_patient, id_doctor) VALUES
('2025-05-18', '10:00:00', 'confirmed', 14, 2),
('2025-05-19', '15:30:00', 'pending', 15, 5);

-- 4. Historial de turnos
INSERT INTO appointment_history (notes, id_appointment) VALUES
('Paciente llegó a tiempo y fue atendido correctamente.', 1),
('Turno pendiente, aún sin notas.', 2);

-- 5. Mensajes
INSERT INTO messages (content, sent_at, id_sender, id_receiver) VALUES
('Hola doctor, tengo una duda.', NOW(), 14, 2),
('Claro, decime.', NOW(), 14, 1),
('Buenas tardes, ¿cómo sigue el paciente?', NOW(), 6, 15);

-- 6. Encuestas
INSERT INTO surveys (rating, comment, submitted_at, id_appointment) VALUES
(5, 'Excelente atención.', NOW(), 1),
(3, 'Todo bien, pero hubo demoras.', NOW(), 2);

-- 7 Disponibilidad de médicos
INSERT INTO doctor_schedules (id_doctor, weekday, start_time, end_time) VALUES
(1, 'monday', '08:00:00', '12:00:00'),
(2, 'tuesday', '13:00:00', '17:00:00'),
(3, 'wednesday', '10:00:00', '14:00:00'),
(4, 'thursday', '09:00:00', '13:00:00'),
(5, 'friday', '14:00:00', '18:00:00'),
(6, 'monday', '15:00:00', '19:00:00'),
(7, 'wednesday', '08:00:00', '12:00:00'),
(8, 'friday', '10:00:00', '14:00:00'),
(9, 'tuesday', '09:00:00', '13:00:00'),
(10, 'thursday', '11:00:00', '15:00:00');

--8 No disponibilidad de médicos
INSERT INTO doctor_exceptions (id_doctor, exception_date, reason, is_available) VALUES
(2, '2025-06-20', 'Jornada académica', FALSE),
(4, '2025-06-28', 'Licencia médica', FALSE),
(6, '2025-07-05', 'Guardia de emergencia', FALSE);


