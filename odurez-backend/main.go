package main

import (
	"log"
	"odurez-backend/database"
	"odurez-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors" // Bunu ekle
)

func main() {
	database.ConnectDb()

	app := fiber.New()

	// CORS Ayarı: Frontend'in (React) backend ile konuşabilmesi için şart!
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Şimdilik her yerden gelen isteğe izin ver
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	routes.SetupRoutes(app)

	log.Fatal(app.Listen(":8080"))
}
