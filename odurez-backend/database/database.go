package database

import (
	"log"
	"odurez-backend/models"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

// Global veritabanı değişkenimiz
var DB *gorm.DB

// ConnectDb fonksiyonu
func ConnectDb() {
	var err error
	DB, err = gorm.Open(sqlite.Open("odurez.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Veritabanına bağlanılamadı! Hata:\n", err)
	}
	log.Println("Veritabanı bağlantısı başarılı!")
	err = DB.AutoMigrate(
		&models.User{},
		&models.Faculty{},
		&models.Room{},
		&models.Reservation{},
	)
	if err != nil {
		log.Fatal("Tablolar oluşturulamadı! Hata:\n", err)
	}
	log.Println("Veritabanı tabloları başarıyla oluşturuldu/güncellendi!")
}
