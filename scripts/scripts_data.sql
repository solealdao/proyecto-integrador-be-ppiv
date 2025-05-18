-- 1. Tipos de usuario
INSERT INTO user_types (name) VALUES
('Paciente'),
('Doctor'),
('Administrador');

-- 2. Usuarios
INSERT INTO users (first_name, last_name, email, password, id_user_type) VALUES
('Juan', 'Pérez', 'juan.perez@example.com', 'pass123', 1), -- Paciente
('Ana', 'Gómez', 'ana.gomez@example.com', 'pass123', 2),   -- Doctor
('Luis', 'Martínez', 'luis.martinez@example.com', 'pass123', 3), -- Admin
('María', 'López', 'maria.lopez@example.com', 'pass123', 1), -- Paciente
('Carlos', 'Sánchez', 'carlos.sanchez@example.com', 'pass123', 2); -- Doctor

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
