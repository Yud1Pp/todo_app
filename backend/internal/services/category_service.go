package services

import (
	"errors"

	"todo-app-backend/internal/models"
	"todo-app-backend/internal/repository"

	"gorm.io/gorm"
)

type CategoryService struct {
	repo repository.ICategoryRepository
}

func NewCategoryService(repo repository.ICategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) Create(name, color string) (*models.Category, error) {
	if name == "" {
		return nil, errors.New("category name is required")
	}

	if color == "" {
		color = "#3B82F6"
	}

	category := &models.Category{
		Name:  name,
		Color: color,
	}

	err := s.repo.Create(category)
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (s *CategoryService) GetAll(page, limit int) ([]models.Category, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	return s.repo.GetAll(page, limit)
}

func (s *CategoryService) GetByID(id int) (*models.Category, error) {
	if id < 1 {
		return nil, errors.New("invalid category id")
	}

	return s.repo.GetByID(id)
}

func (s *CategoryService) Update(id int, name, color string) (*models.Category, error) {
	if id < 1 {
		return nil, errors.New("invalid category id")
	}

	category, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if name != "" {
		category.Name = name
	}

	if color != "" {
		category.Color = color
	}

	err = s.repo.Update(category)
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (s *CategoryService) Delete(id int) error {
	if id < 1 {
		return errors.New("invalid category id")
	}

	_, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	return s.repo.Delete(id)
}

func (s *CategoryService) IsCategoryExists(id int) bool {
	_, err := s.repo.GetByID(id)
	return err == nil
}

func (s *CategoryService) IsCategoryExistsWithTx(tx *gorm.DB, id int) bool {
	var count int64
	tx.Model(&models.Category{}).Where("id = ?", id).Count(&count)
	return count > 0
}