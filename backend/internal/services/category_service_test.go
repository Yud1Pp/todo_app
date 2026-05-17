package services

import (
	"errors"
	"testing"

	"todo-app-backend/internal/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockCategoryRepository struct {
	mock.Mock
}

func (m *MockCategoryRepository) Create(category *models.Category) error {
	args := m.Called(category)
	return args.Error(0)
}

func (m *MockCategoryRepository) GetAll(page, limit int) ([]models.Category, int64, error) {
	args := m.Called(page, limit)
	return args.Get(0).([]models.Category), args.Get(1).(int64), args.Error(2)
}

func (m *MockCategoryRepository) GetByID(id int) (*models.Category, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Category), args.Error(1)
}

func (m *MockCategoryRepository) Update(category *models.Category) error {
	args := m.Called(category)
	return args.Error(0)
}

func (m *MockCategoryRepository) Delete(id int) error {
	args := m.Called(id)
	return args.Error(0)
}

func TestCategoryService_Create_Success(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	mockRepo.On("Create", mock.Anything).Return(nil).Once()

	service := NewCategoryService(mockRepo)

	result, err := service.Create("Work", "#3B82F6")

	assert.NoError(t, err)
	assert.Equal(t, "Work", result.Name)
	assert.Equal(t, "#3B82F6", result.Color)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_Create_EmptyName(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	service := NewCategoryService(mockRepo)

	result, err := service.Create("", "#3B82F6")

	assert.Error(t, err)
	assert.Equal(t, "category name is required", err.Error())
	assert.Nil(t, result)
	mockRepo.AssertNotCalled(t, "Create")
}

func TestCategoryService_Create_WithDefaultColor(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	mockRepo.On("Create", mock.Anything).Return(nil).Once()

	service := NewCategoryService(mockRepo)

	result, err := service.Create("Personal", "")

	assert.NoError(t, err)
	assert.Equal(t, "Personal", result.Name)
	assert.Equal(t, "#3B82F6", result.Color)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_Create_RepositoryError(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	mockRepo.On("Create", mock.Anything).Return(errors.New("database error")).Once()

	service := NewCategoryService(mockRepo)

	result, err := service.Create("Work", "#3B82F6")

	assert.Error(t, err)
	assert.Equal(t, "database error", err.Error())
	assert.Nil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_GetAll_Success(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	categories := []models.Category{
		{ID: 1, Name: "Work", Color: "#3B82F6"},
		{ID: 2, Name: "Personal", Color: "#10B981"},
	}

	mockRepo.On("GetAll", 1, 10).Return(categories, int64(2), nil).Once()

	service := NewCategoryService(mockRepo)

	result, total, err := service.GetAll(1, 10)

	assert.NoError(t, err)
	assert.Equal(t, 2, len(result))
	assert.Equal(t, int64(2), total)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_GetAll_DefaultPagination(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	mockRepo.On("GetAll", 1, 10).Return([]models.Category{}, int64(0), nil).Once()

	service := NewCategoryService(mockRepo)

	result, total, err := service.GetAll(0, 0)

	assert.NoError(t, err)
	assert.Equal(t, int64(0), total)
	assert.NotNil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_GetByID_Success(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	category := &models.Category{ID: 1, Name: "Work", Color: "#3B82F6"}

	mockRepo.On("GetByID", 1).Return(category, nil).Once()

	service := NewCategoryService(mockRepo)

	result, err := service.GetByID(1)

	assert.NoError(t, err)
	assert.Equal(t, 1, result.ID)
	assert.Equal(t, "Work", result.Name)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_GetByID_InvalidID(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	service := NewCategoryService(mockRepo)

	result, err := service.GetByID(0)

	assert.Error(t, err)
	assert.Equal(t, "invalid category id", err.Error())
	assert.Nil(t, result)
	mockRepo.AssertNotCalled(t, "GetByID")
}

func TestCategoryService_GetByID_NotFound(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	mockRepo.On("GetByID", 999).Return(nil, errors.New("record not found")).Once()

	service := NewCategoryService(mockRepo)

	result, err := service.GetByID(999)

	assert.Error(t, err)
	assert.Nil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_Update_Success(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	oldCategory := &models.Category{ID: 1, Name: "Work", Color: "#3B82F6"}
	updatedCategory := &models.Category{ID: 1, Name: "Work Updated", Color: "#FF0000"}

	// First call returns old, then update, then second GetByID returns updated
	mockRepo.On("GetByID", 1).Return(oldCategory, nil)
	mockRepo.On("Update", mock.Anything).Return(nil)
	mockRepo.On("GetByID", 1).Return(updatedCategory, nil)

	service := NewCategoryService(mockRepo)

	result, err := service.Update(1, "Work Updated", "#FF0000")

	assert.NoError(t, err)
	assert.Equal(t, "Work Updated", result.Name)
	assert.Equal(t, "#FF0000", result.Color)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_Update_NotFound(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	mockRepo.On("GetByID", 999).Return(nil, errors.New("record not found")).Once()

	service := NewCategoryService(mockRepo)

	result, err := service.Update(999, "New Name", "")

	assert.Error(t, err)
	assert.Nil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_Update_InvalidID(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	service := NewCategoryService(mockRepo)

	result, err := service.Update(0, "New Name", "")

	assert.Error(t, err)
	assert.Equal(t, "invalid category id", err.Error())
	assert.Nil(t, result)
}

func TestCategoryService_Delete_Success(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	mockRepo.On("GetByID", 1).Return(&models.Category{ID: 1, Name: "Work"}, nil).Once()
	mockRepo.On("Delete", 1).Return(nil).Once()

	service := NewCategoryService(mockRepo)

	err := service.Delete(1)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_Delete_NotFound(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	mockRepo.On("GetByID", 999).Return(nil, errors.New("record not found")).Once()

	service := NewCategoryService(mockRepo)

	err := service.Delete(999)

	assert.Error(t, err)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_Delete_InvalidID(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	service := NewCategoryService(mockRepo)

	err := service.Delete(0)

	assert.Error(t, err)
	assert.Equal(t, "invalid category id", err.Error())
}

func TestCategoryService_IsCategoryExists_True(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	mockRepo.On("GetByID", 1).Return(&models.Category{ID: 1}, nil).Once()

	service := NewCategoryService(mockRepo)

	exists := service.IsCategoryExists(1)

	assert.True(t, exists)
	mockRepo.AssertExpectations(t)
}

func TestCategoryService_IsCategoryExists_False(t *testing.T) {
	mockRepo := new(MockCategoryRepository)

	mockRepo.On("GetByID", 999).Return(nil, errors.New("record not found")).Once()

	service := NewCategoryService(mockRepo)

	exists := service.IsCategoryExists(999)

	assert.False(t, exists)
	mockRepo.AssertExpectations(t)
}