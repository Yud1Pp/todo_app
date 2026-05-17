package services

import (
	"errors"

	"todo-app-backend/internal/models"
	"todo-app-backend/internal/repository"
)

type TodoService struct {
	repo             repository.ITodoRepository
	categoryService  ICategoryService
}

func NewTodoService(repo repository.ITodoRepository, categoryService ICategoryService) *TodoService {
	return &TodoService{
		repo:            repo,
		categoryService: categoryService,
	}
}

var validPriorities = map[string]bool{
	"high":   true,
	"medium": true,
	"low":    true,
}

func isValidPriority(p string) bool {
	return validPriorities[p]
}

func (s *TodoService) Create(todo *models.Todo) (*models.Todo, error) {
	if todo.Title == "" {
		return nil, errors.New("todo title is required")
	}

	if todo.Priority == "" {
		todo.Priority = "medium"
	}

	if !isValidPriority(todo.Priority) {
		return nil, errors.New("invalid priority. must be: high, medium, or low")
	}

	if todo.CategoryID != nil && !s.categoryService.IsCategoryExists(*todo.CategoryID) {
		return nil, errors.New("category not found")
	}

	err := s.repo.Create(todo)
	if err != nil {
		return nil, err
	}

	return s.repo.GetByID(todo.ID)
}

func (s *TodoService) GetAll(page, limit int, search, filterBy, filterValue string) ([]models.Todo, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	return s.repo.GetAll(page, limit, search, filterBy, filterValue)
}

func (s *TodoService) GetByID(id int) (*models.Todo, error) {
	if id < 1 {
		return nil, errors.New("invalid todo id")
	}

	return s.repo.GetByID(id)
}

func (s *TodoService) Update(todo *models.Todo) (*models.Todo, error) {
	if todo.ID < 1 {
		return nil, errors.New("invalid todo id")
	}

	if todo.Title == "" {
		return nil, errors.New("todo title is required")
	}

	if todo.Priority != "" && !isValidPriority(todo.Priority) {
		return nil, errors.New("invalid priority. must be: high, medium, or low")
	}

	if todo.CategoryID != nil && !s.categoryService.IsCategoryExists(*todo.CategoryID) {
		return nil, errors.New("category not found")
	}

	err := s.repo.Update(todo)
	if err != nil {
		return nil, err
	}

	return s.repo.GetByID(todo.ID)
}

func (s *TodoService) Delete(id int) error {
	if id < 1 {
		return errors.New("invalid todo id")
	}

	_, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	return s.repo.Delete(id)
}

func (s *TodoService) ToggleComplete(id int) (*models.Todo, error) {
	if id < 1 {
		return nil, errors.New("invalid todo id")
	}

	_, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	err = s.repo.ToggleComplete(id)
	if err != nil {
		return nil, err
	}

	return s.repo.GetByID(id)
}