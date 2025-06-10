describe('appointmentsRoutes - middleware', () => {
    beforeEach(() => {
      //reiniciamos sist de modulos y mocks
      jest.resetModules();
      jest.clearAllMocks();
    });
  
    test('should apply authentication middleware to all routes', () => {
      const mockUse = jest.fn();
      //objeto para simular el router de Express.
      const mockRouter = {
        use: mockUse,
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
      };
  //mock router
      jest.mock('express', () => ({
        Router: jest.fn(() => mockRouter)
      }));
  //mock middleware de autenticacion
      const mockAuth = jest.fn();
      jest.mock('../middlewares/authenticateToken', () => mockAuth);
  //mock del controlador
      jest.mock('../controllers/appointmentController', () => ({
        createAppointment: jest.fn(),
        getMyAppointments: jest.fn(),
        getAllAppointments: jest.fn()
      }));
  
      require('../routes/appointmentsRoutes');
     //Se verifica que el middleware (mockAuth) fue pasado al router mediante use(...).
      expect(mockUse).toHaveBeenCalledWith(mockAuth);
     //Se asegura de que fue llamado una sola vez.
      expect(mockUse).toHaveBeenCalledTimes(1);
    });
  });
  
  