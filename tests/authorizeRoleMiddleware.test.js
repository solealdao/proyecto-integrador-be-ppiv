// Importamos el middleware que vamos a probar
const authorizeRole = require('../middlewares/authorizeRole');

describe('authorizeRole middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  // Configuramos los mocks para req, res y next antes de cada test
  beforeEach(() => {
    mockReq = {
      user: { // Simular que authenticateToken ya añadió el usuario
        id: 1,
        id_user_type: null // Esto se sobrescribirá en cada test
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn(); //
  });

  // Test 1: El usuario tiene un rol permitido, debe llamar a next()
  test('should call next() if user role is allowed', () => {
    mockReq.user.id_user_type = 1; // Suponemos que 1 es 'admin' o un rol permitido
    const allowedRoles = [1, 2]; // Roles permitidos: 'admin', 'doctor'

    const middleware = authorizeRole(allowedRoles);
    middleware(mockReq, mockRes, mockNext);
    // Esperamos que next() sea llamado, indicando que el acceso fue concedido
    expect(mockNext).toHaveBeenCalledTimes(1);
    // Aseguramos que status y json NO fueron llamados (no hubo error de autorización)
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  // Test 2: El usuario NO tiene un rol permitido, debe devolver 403
  test('should return 403 and "Access denied" if user role is not allowed', () => {
    mockReq.user.id_user_type = 3; // Suponemos que 3 es 'patient' o un rol no permitido
    const allowedRoles = [1, 2]; // Roles permitidos: 'admin', 'doctor'

    const middleware = authorizeRole(allowedRoles);
    middleware(mockReq, mockRes, mockNext);

    // Esperamos que next() NO sea llamado (acceso denegado)
    expect(mockNext).not.toHaveBeenCalled();
    // Esperamos que status sea llamado con 403
    expect(mockRes.status).toHaveBeenCalledWith(403);
    // Esperamos que json sea llamado con el mensaje de denegación
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Acceso denegado' });
  });

  // Test 3: El usuario no tiene un tipo de usuario definido, debe devolver 403 (caso de seguridad)
  test('should return 403 if id_user_type is missing', () => {
    mockReq.user.id_user_type = undefined; // Simulamos que el tipo de usuario no está definido
    const allowedRoles = [1, 2];

    const middleware = authorizeRole(allowedRoles);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Acceso denegado' });
  });

  // Test 4: req.user no está definido (aunque authenticateToken debería manejar esto antes)
  test('should return 403 if req.user is missing (safety check)', () => {
    mockReq.user = undefined; // Simular que authenticateToken falló o no se ejecutó
    const allowedRoles = [1, 2];
    const middleware = authorizeRole(allowedRoles);
    middleware(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Acceso denegado' });
  });
});