package controllers

import (
	"odurez-backend/database"
	"odurez-backend/models"

	"github.com/gofiber/fiber/v2"
)

// Yeni Salon Ekleme (POST)
func CreateRoom(c *fiber.Ctx) error {
	room := new(models.Room)
	if err := c.BodyParser(room); err != nil {
		return c.Status(400).JSON(fiber.Map{"hata": "Salon verisi okunamadı!"})
	}
	if err := database.DB.Create(&room).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"hata": "Salon kaydedilemedi!"})
	}
	return c.Status(201).JSON(room)
}

// Salonları Listeleme ve Filtreleme (GET)
func GetRooms(c *fiber.Ctx) error {
	var rooms []models.Room
	fakulteID := c.Query("fakulteId")
	query := database.DB
	if fakulteID != "" && fakulteID != "undefined" {
		query = query.Where("fakulte_id = ?", fakulteID)
	}
	if err := query.Find(&rooms).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"hata": err.Error()})
	}
	return c.JSON(rooms)
}
