package models

import (
	"gorm.io/gorm"
)

// User tablosu
type User struct {
	gorm.Model
	Username string `gorm:"unique;not null" json:"username"`
	Password string `gorm:"not null" json:"password"`
	Role     string `gorm:"default:'USER'" json:"role"`
}

// Faculty tablosu
type Faculty struct {
	gorm.Model
	Name  string `gorm:"not null" json:"name"`
	Rooms []Room `gorm:"foreignKey:FacultyID" json:"salonlar,omitempty"`
}

// Room (Salon) tablosu
type Room struct {
	gorm.Model
	Name      string `gorm:"not null" json:"name"`
	FacultyID uint   `gorm:"not null;column:fakulte_id" json:"fakulte_id"`
}

// Reservation tablosu
type Reservation struct {
	gorm.Model
	Title       string  `json:"baslik"`
	Description string  `json:"aciklama"`
	Type        string  `json:"tur"`
	Date        string  `json:"date"`
	StartTime   string  `json:"startTime"`
	EndTime     string  `json:"endTime"`
	FacultyID   uint    `json:"fakulte_id"`
	Faculty     Faculty `gorm:"foreignKey:FacultyID" json:"fakulte"` // Bunu ekle
	RoomID      uint    `json:"salon_id"`
	Room        Room    `gorm:"foreignKey:RoomID" json:"salon"` // Bunu ekle
	UserID      uint    `json:"user_id"`
}
