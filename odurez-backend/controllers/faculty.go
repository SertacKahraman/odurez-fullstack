package controllers

import (
	"odurez-backend/database" // Veritabanı bağlantımızı kullanmak için
	"odurez-backend/models"   // Fakülte kalıbımızı kullanmak için

	"github.com/gofiber/fiber/v2"
)

// Fakülteleri Listeleme (GET)
func GetFaculties(c *fiber.Ctx) error {
	var faculties []models.Faculty
	if err := database.DB.Find(&faculties).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"hata": "Fakülteler getirilemedi!"})
	}
	return c.JSON(faculties)
}

// Yeni Fakülte Ekleme (POST)
func CreateFaculty(c *fiber.Ctx) error {
	faculty := new(models.Faculty)
	if err := c.BodyParser(faculty); err != nil {
		return c.Status(400).JSON(fiber.Map{"hata": "Fakülte verisi okunamadı!"})
	}
	if err := database.DB.Create(&faculty).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"hata": "Fakülte kaydedilemedi!"})
	}
	return c.Status(201).JSON(faculty)
}
