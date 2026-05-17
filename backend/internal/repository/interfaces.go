package repository

import "todo-app-backend/internal/models"

type ICategoryRepository interface {
	Create(category *models.Category) error
	GetAll(page, limit int) ([]models.Category, int64, error)
	GetByID(id int) (*models.Category, error)
	Update(category *models.Category) error
	Delete(id int) error
}

type ITodoRepository interface {
	Create(todo *models.Todo) error
	GetAll(page, limit int, search, filterBy, filterValue string) ([]models.Todo, int64, error)
	GetByID(id int) (*models.Todo, error)
	Update(todo *models.Todo) error
	Delete(id int) error
	ToggleComplete(id int) error
}