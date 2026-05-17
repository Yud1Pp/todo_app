package services

import "todo-app-backend/internal/models"

type ICategoryService interface {
	Create(name, color string) (*models.Category, error)
	GetAll(page, limit int) ([]models.Category, int64, error)
	GetByID(id int) (*models.Category, error)
	Update(id int, name, color string) (*models.Category, error)
	Delete(id int) error
	IsCategoryExists(id int) bool
}