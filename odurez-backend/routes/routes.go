package routes

import (
	"odurez-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

// SetupRoutes: Bütün URL yönlendirmelerimizin toplandığı merkez
func SetupRoutes(app *fiber.App) {

	// Test Rotası
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"mesaj": "Odurez API profesyonel mimariyle tıkır tıkır çalışıyor! 🚀",
		})
	})

	// Fakülte Rotaları
	app.Get("/fakulteler", controllers.GetFaculties)
	app.Post("/fakulteler", controllers.CreateFaculty)

	// Salon Rotaları
	app.Get("/salonlar", controllers.GetRooms)
	app.Post("/salonlar", controllers.CreateRoom)

	// Rezervasyon Rotaları
	app.Get("/rezervasyonlar", controllers.GetReservations)
	app.Post("/rezervasyonlar", controllers.CreateReservation)
	app.Put("/rezervasyonlar/:id", controllers.UpdateReservation)
	app.Delete("/rezervasyonlar/:id", controllers.DeleteReservation)

	// Auth Rotaları
	app.Post("/auth/register", controllers.Register)
	app.Post("/auth/login", controllers.Login)
}
