package controllers

import (
	"odurez-backend/database"
	"odurez-backend/models"

	"github.com/gofiber/fiber/v2"
)

// Yeni Rezervasyon Oluşturma (POST)
func CreateReservation(c *fiber.Ctx) error {
	res := new(models.Reservation)
	if err := c.BodyParser(res); err != nil {
		return c.Status(400).JSON(fiber.Map{"hata": "Rezervasyon verisi okunamadı!"})
	}
	var count int64
	database.DB.Model(&models.Reservation{}).Where(
		"room_id = ? AND date = ? AND NOT (end_time <= ? OR start_time >= ?)",
		res.RoomID, res.Date, res.StartTime, res.EndTime,
	).Count(&count)
	if count > 0 {
		return c.Status(409).JSON(fiber.Map{
			"hata": "Seçilen saat aralığında salon dolu! Lütfen başka bir zaman seçin.",
		})
	}
	if err := database.DB.Create(&res).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"hata": "Rezervasyon kaydedilemedi!"})
	}
	return c.Status(201).JSON(res)
}

// Tüm Rezervasyonları Listeleme (GET)
func GetReservations(c *fiber.Ctx) error {
	var reservations []models.Reservation
	if err := database.DB.Preload("Room").Preload("Faculty").Find(&reservations).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"hata": "Rezervasyonlar getirilemedi!"})
	}
	return c.JSON(reservations)
}

// Rezervasyon Silme
func DeleteReservation(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.Reservation{}, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"hata": "Silinemedi"})
	}
	return c.JSON(fiber.Map{"mesaj": "Başarıyla silindi"})
}

// --- REZERVASYON GÜNCELLEME ---
func UpdateReservation(c *fiber.Ctx) error {
	id := c.Params("id")
	var reservation models.Reservation

	// Önce var olanı bul
	if err := database.DB.First(&reservation, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"hata": "Rezervasyon bulunamadı"})
	}

	// Yeni verileri al
	if err := c.BodyParser(&reservation); err != nil {
		return c.Status(400).JSON(fiber.Map{"hata": "Veri okunamadı"})
	}

	database.DB.Save(&reservation)
	return c.JSON(reservation)
}
