package repository

import (
	"todo-app-backend/internal/models"

	"gorm.io/gorm"
)

type TodoRepository struct {
	db *gorm.DB
}

func NewTodoRepository(db *gorm.DB) *TodoRepository {
	return &TodoRepository{db: db}
}

func (r *TodoRepository) Create(todo *models.Todo) error {
	return r.db.Create(todo).Error
}

func (r *TodoRepository) GetAll(page, limit int, search, filterBy, filterValue string) ([]models.Todo, int64, error) {
	var todos []models.Todo
	var total int64

	offset := (page - 1) * limit

	query := r.db.Model(&models.Todo{}).Preload("Category")

	if search != "" {
		query = query.Where("title ILIKE ?", "%"+search+"%")
	}

	if filterBy != "" && filterValue != "" {
		switch filterBy {
		case "completed":
			if filterValue == "true" {
				query = query.Where("completed = ?", true)
			} else {
				query = query.Where("completed = ?", false)
			}
		case "category_id":
			query = query.Where("category_id = ?", filterValue)
		case "priority":
			query = query.Where("priority = ?", filterValue)
		}
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&todos).Error
	if err != nil {
		return nil, 0, err
	}

	return todos, total, nil
}

func (r *TodoRepository) GetByID(id int) (*models.Todo, error) {
	var todo models.Todo
	err := r.db.Preload("Category").First(&todo, id).Error
	if err != nil {
		return nil, err
	}
	return &todo, nil
}

func (r *TodoRepository) Update(todo *models.Todo) error {
	return r.db.Save(todo).Error
}

func (r *TodoRepository) Delete(id int) error {
	return r.db.Delete(&models.Todo{}, id).Error
}

func (r *TodoRepository) ToggleComplete(id int) error {
	var todo models.Todo
	if err := r.db.First(&todo, id).Error; err != nil {
		return err
	}
	todo.Completed = !todo.Completed
	return r.db.Save(&todo).Error
}