describe("appointmentsRoutes - auth rejection", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
//test cuyo objetivo es verificar si una solicitud sin token es rechazada correctamente.
  it("should reject requests when authentication token is missing", async () => {
    // Mock controller 
    jest.mock("../controllers/appointmentController", () => ({
      getAllAppointments: jest.fn((req, res) => res.json([])),
      createAppointment: jest.fn((req, res) =>
        res.status(201).json({ id_appointment: 1 })
      ),
      getAppointmentsByDoctor: jest.fn((req, res) => res.json([])),
      getAppointmentById: jest.fn((req, res) => res.json({})),
      cancelAppointment: jest.fn((req, res) =>
        res.status(200).json({ message: "Turno cancelado con éxito" })
      ),
      updateAppointment: jest.fn((req, res) =>
        res.status(200).json({ message: "Turno actualizado con éxito" })
      ),
      getMyAppointments: jest.fn((req, res) => res.json([])),
      addOrUpdateAppointmentNotes: jest.fn((req, res) =>
        res.status(200).json({ message: "Notas agregadas/actualizadas" })
      ),
    }));
 //Mock del middleware de autenticación
    jest.mock("../middlewares/authenticateToken", () =>
      jest.fn((req, res, next) => {
        if (!req.headers.authorization) {
          return res.status(401).json({ error: "Access denied" });
        }
        next();
      })
    );
    //app temporal para probar el test
    const express = require("express");
    const request = require("supertest");
    const app = express();
    app.use(express.json());

    const appointmentsRoutes = require("../routes/appointmentsRoutes");
    app.use("/appointments", appointmentsRoutes);

    //se hace una petición GET a /appointments/all sin token.
    const res = await request(app).get("/appointments/all");
    //resultados esperados 
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Access denied");
  });
});
