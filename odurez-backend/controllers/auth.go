package controllers

import (
	"odurez-backend/database"
	"odurez-backend/models"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"

	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Kayıt Olma (Register)
func Register(c *fiber.Ctx) error {
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(fiber.Map{"hata": "Geçersiz veri!"})
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"hata": "Şifre işlenemedi!"})
	}
	user.Password = string(hashedPassword)
	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"hata": "Kullanıcı oluşturulamadı! (Belki bu kullanıcı adı alınmıştır)"})
	}
	user.Password = ""
	return c.Status(201).JSON(user)
}

// Giriş Yapma (Login)
func Login(c *fiber.Ctx) error {
	type LoginInput struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	input := new(LoginInput)
	if err := c.BodyParser(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"hata": "Geçersiz giriş!"})
	}
	var user models.User
	if err := database.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		return c.Status(401).JSON(fiber.Map{"hata": "Kullanıcı bulunamadı!"})
	}
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"hata": "Hatalı şifre!"})
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})
	t, err := token.SignedString([]byte("cok_gizli_anahtar_123"))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"hata": "Token üretilemedi!"})
	}
	return c.JSON(fiber.Map{"token": t, "user": user})
}
