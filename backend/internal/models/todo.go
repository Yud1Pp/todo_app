package models

import (
	"time"
)

type Todo struct {
	ID          int        `gorm:"primaryKey" json:"id"`
	Title       string     `gorm:"size:255;not null" json:"title"`
	Description string     `gorm:"type:text" json:"description"`
	Completed   bool       `gorm:"default:false" json:"completed"`
	CategoryID  *int       `json:"category_id"`
	Category    Category   `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Priority    string     `gorm:"size:10;default:medium" json:"priority"`
	DueDate     *time.Time `json:"due_date"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

func (Todo) TableName() string {
	return "todos"
}