-- 1. Tipos de usuario
INSERT INTO user_types (name) VALUES
('Paciente'),
('Doctor'),
('Administrador');

-- 2. Usuarios
INSERT INTO users (first_name, last_name, email, password, id_user_type, is_active) VALUES
('Juan', 'Pérez', 'juan.perez@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 1, TRUE),  -- Paciente
('Ana', 'Gómez', 'ana.gomez@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, TRUE),   -- Doctor
('Luis', 'Martínez', 'luis.martinez@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 3, TRUE), -- Admin
('María', 'López', 'maria.lopez@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 1, TRUE), -- Paciente
('Carlos', 'Sánchez', 'carlos.sanchez@example.com', '$2b$10$qAZ/fgFDX/xShEIy3tManeqpSLDL8dVGDg43yXIm/OycR/Va.GXmq', 2, FALSE); -- Doctor inactivo

-- 3. Turnos (Appointments)
INSERT INTO appointments (date, time, status, id_patient, id_doctor) VALUES
('2025-05-18', '10:00:00', 'confirmed', 1, 2),
('2025-05-19', '15:30:00', 'pending', 4, 5);

-- 4. Historial de turnos
INSERT INTO appointment_history (notes, id_appointment) VALUES
('Paciente llegó a tiempo y fue atendido correctamente.', 1),
('Turno pendiente, aún sin notas.', 2);

-- 5. Mensajes
INSERT INTO messages (content, sent_at, id_sender, id_receiver) VALUES
('Hola doctor, tengo una duda.', NOW(), 1, 2),
('Claro, decime.', NOW(), 2, 1),
('Buenas tardes, ¿cómo sigue el paciente?', NOW(), 5, 4);

-- 6. Notificaciones
INSERT INTO notifications (message, type, sent_at, id_user) VALUES
('Recordatorio: tenés un turno mañana.', 'reminder', NOW(), 1),
('Nuevo mensaje del doctor.', 'message', NOW(), 1),
('Tu encuesta fue enviada.', 'other', NOW(), 1);

-- 7. Encuestas
INSERT INTO surveys (rating, comment, submitted_at, id_appointment) VALUES
(5, 'Excelente atención.', NOW(), 1),
(3, 'Todo bien, pero hubo demoras.', NOW(), 2);


-- Disponibilidad de Ana Gómez (Lunes a Viernes de 09:00 a 13:00)
INSERT INTO doctor_schedules (id_doctor, weekday, start_time, end_time) VALUES
(2, 'monday', '09:00:00', '13:00:00'),
(2, 'tuesday', '09:00:00', '13:00:00'),
(2, 'wednesday', '09:00:00', '13:00:00'),
(2, 'thursday', '09:00:00', '13:00:00'),
(2, 'friday', '09:00:00', '13:00:00');

-- Disponibilidad de Carlos Sánchez (Martes y Jueves de 15:00 a 18:00)
INSERT INTO doctor_schedules (id_doctor, weekday, start_time, end_time) VALUES
(5, 'tuesday', '15:00:00', '18:00:00'),
(5, 'thursday', '15:00:00', '18:00:00');

-- Ana Gómez no atenderá el 2025-06-10 por congreso
INSERT INTO doctor_exceptions (id_doctor, exception_date, reason, is_available) VALUES
(2, '2025-06-10', 'Asistencia a congreso médico', FALSE);

-- Carlos Sánchez decidió atender excepcionalmente el sábado 2025-06-15
INSERT INTO doctor_exceptions (id_doctor, exception_date, reason, is_available) VALUES
(5, '2025-06-15', 'Atención extraordinaria por demanda', TRUE);

