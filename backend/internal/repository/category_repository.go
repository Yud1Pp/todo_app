package repository

import (
	"todo-app-backend/internal/models"

	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) Create(category *models.Category) error {
	return r.db.Create(category).Error
}

func (r *CategoryRepository) GetAll(page, limit int) ([]models.Category, int64, error) {
	var categories []models.Category
	var total int64

	offset := (page - 1) * limit

	err := r.db.Model(&models.Category{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&categories).Error
	if err != nil {
		return nil, 0, err
	}

	return categories, total, nil
}

func (r *CategoryRepository) GetByID(id int) (*models.Category, error) {
	var category models.Category
	err := r.db.First(&category, id).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *CategoryRepository) Update(category *models.Category) error {
	return r.db.Save(category).Error
}

func (r *CategoryRepository) Delete(id int) error {
	return r.db.Delete(&models.Category{}, id).Error
}