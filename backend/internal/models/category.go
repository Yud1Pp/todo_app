package models

import "time"

type Category struct {
	ID        int       `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:100;not null" json:"name"`
	Color     string    `gorm:"size:7;default:#3B82F6" json:"color"`
	CreatedAt time.Time `json:"created_at"`
}

func (Category) TableName() string {
	return "categories"
}