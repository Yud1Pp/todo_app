package services

import (
	"errors"
	"testing"

	"todo-app-backend/internal/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockTodoRepository struct {
	mock.Mock
}

func (m *MockTodoRepository) Create(todo *models.Todo) error {
	args := m.Called(todo)
	return args.Error(0)
}

func (m *MockTodoRepository) GetAll(page, limit int, search, filterBy, filterValue string) ([]models.Todo, int64, error) {
	args := m.Called(page, limit, search, filterBy, filterValue)
	return args.Get(0).([]models.Todo), args.Get(1).(int64), args.Error(2)
}

func (m *MockTodoRepository) GetByID(id int) (*models.Todo, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Todo), args.Error(1)
}

func (m *MockTodoRepository) Update(todo *models.Todo) error {
	args := m.Called(todo)
	return args.Error(0)
}

func (m *MockTodoRepository) Delete(id int) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockTodoRepository) ToggleComplete(id int) error {
	args := m.Called(id)
	return args.Error(0)
}

type MockCategoryServiceForTodo struct {
	mock.Mock
}

func (m *MockCategoryServiceForTodo) Create(name, color string) (*models.Category, error) {
	args := m.Called(name, color)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Category), args.Error(1)
}

func (m *MockCategoryServiceForTodo) GetAll(page, limit int) ([]models.Category, int64, error) {
	args := m.Called(page, limit)
	return args.Get(0).([]models.Category), args.Get(1).(int64), args.Error(2)
}

func (m *MockCategoryServiceForTodo) GetByID(id int) (*models.Category, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Category), args.Error(1)
}

func (m *MockCategoryServiceForTodo) Update(id int, name, color string) (*models.Category, error) {
	args := m.Called(id, name, color)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Category), args.Error(1)
}

func (m *MockCategoryServiceForTodo) Delete(id int) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockCategoryServiceForTodo) IsCategoryExists(id int) bool {
	args := m.Called(id)
	return args.Bool(0)
}

func TestTodoService_Create_Success(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	todo := &models.Todo{
		Title:       "Test Todo",
		Description: "Test Description",
		Priority:    "high",
		CategoryID:  nil,
	}

	mockTodoRepo.On("Create", mock.Anything).Return(nil).Once()
	mockTodoRepo.On("GetByID", mock.Anything).Return(todo, nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.Create(todo)

	assert.NoError(t, err)
	assert.Equal(t, "Test Todo", result.Title)
	assert.Equal(t, "high", result.Priority)
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_Create_EmptyTitle(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	todo := &models.Todo{
		Title:       "",
		Priority:    "medium",
	}

	result, err := service.Create(todo)

	assert.Error(t, err)
	assert.Equal(t, "todo title is required", err.Error())
	assert.Nil(t, result)
	mockTodoRepo.AssertNotCalled(t, "Create")
}

func TestTodoService_Create_InvalidPriority(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	todo := &models.Todo{
		Title:    "Test",
		Priority: "invalid",
	}

	result, err := service.Create(todo)

	assert.Error(t, err)
	assert.Equal(t, "invalid priority. must be: high, medium, or low", err.Error())
	assert.Nil(t, result)
}

func TestTodoService_Create_DefaultPriority(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	todo := &models.Todo{
		Title:    "Test",
		Priority: "",
	}

	mockTodoRepo.On("Create", mock.Anything).Return(nil).Once()
	mockTodoRepo.On("GetByID", mock.Anything).Return(todo, nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.Create(todo)

	assert.NoError(t, err)
	assert.Equal(t, "medium", result.Priority)
}

func TestTodoService_Create_InvalidCategory(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	catID := 999
	todo := &models.Todo{
		Title:       "Test",
		Priority:    "medium",
		CategoryID:  &catID,
	}

	mockCategorySvc.On("IsCategoryExists", 999).Return(false).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.Create(todo)

	assert.Error(t, err)
	assert.Equal(t, "category not found", err.Error())
	assert.Nil(t, result)
}

func TestTodoService_GetAll_Success(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	todos := []models.Todo{
		{ID: 1, Title: "Todo 1", Priority: "high"},
		{ID: 2, Title: "Todo 2", Priority: "medium"},
	}

	mockTodoRepo.On("GetAll", 1, 10, "", "", "").Return(todos, int64(2), nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, total, err := service.GetAll(1, 10, "", "", "")

	assert.NoError(t, err)
	assert.Equal(t, 2, len(result))
	assert.Equal(t, int64(2), total)
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_GetAll_WithSearch(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	todos := []models.Todo{
		{ID: 1, Title: "Complete challenge"},
	}

	mockTodoRepo.On("GetAll", 1, 10, "challenge", "", "").Return(todos, int64(1), nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, total, err := service.GetAll(1, 10, "challenge", "", "")

	assert.NoError(t, err)
	assert.Equal(t, 1, len(result))
	assert.Equal(t, int64(1), total)
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_GetAll_WithFilterCompleted(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	todos := []models.Todo{
		{ID: 1, Title: "Todo 1", Completed: true},
	}

	mockTodoRepo.On("GetAll", 1, 10, "", "completed", "true").Return(todos, int64(1), nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, _, err := service.GetAll(1, 10, "", "completed", "true")

	assert.NoError(t, err)
	assert.Equal(t, 1, len(result))
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_GetAll_WithFilterCategory(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	todos := []models.Todo{
		{ID: 1, Title: "Todo 1", CategoryID: ptrToInt(1)},
	}

	mockTodoRepo.On("GetAll", 1, 10, "", "category_id", "1").Return(todos, int64(1), nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, _, err := service.GetAll(1, 10, "", "category_id", "1")

	assert.NoError(t, err)
	assert.Equal(t, 1, len(result))
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_GetAll_WithFilterPriority(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	todos := []models.Todo{
		{ID: 1, Title: "Todo 1", Priority: "high"},
	}

	mockTodoRepo.On("GetAll", 1, 10, "", "priority", "high").Return(todos, int64(1), nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, _, err := service.GetAll(1, 10, "", "priority", "high")

	assert.NoError(t, err)
	assert.Equal(t, 1, len(result))
	assert.Equal(t, "high", result[0].Priority)
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_GetAll_DefaultPagination(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	mockTodoRepo.On("GetAll", 1, 10, "", "", "").Return([]models.Todo{}, int64(0), nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, total, err := service.GetAll(0, 0, "", "", "")

	assert.NoError(t, err)
	assert.Equal(t, int64(0), total)
	assert.NotNil(t, result)
}

func TestTodoService_GetByID_Success(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	todo := &models.Todo{
		ID:     1,
		Title:  "Test Todo",
		Priority: "high",
	}

	mockTodoRepo.On("GetByID", 1).Return(todo, nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.GetByID(1)

	assert.NoError(t, err)
	assert.Equal(t, 1, result.ID)
	assert.Equal(t, "Test Todo", result.Title)
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_GetByID_InvalidID(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.GetByID(0)

	assert.Error(t, err)
	assert.Equal(t, "invalid todo id", err.Error())
	assert.Nil(t, result)
}

func TestTodoService_GetByID_NotFound(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	mockTodoRepo.On("GetByID", 999).Return(nil, errors.New("record not found")).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.GetByID(999)

	assert.Error(t, err)
	assert.Nil(t, result)
}

func TestTodoService_Update_Success(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	existingTodo := &models.Todo{
		ID:          1,
		Title:       "Old Title",
		Description: "Old Description",
		Priority:    "medium",
	}

	updatedTodo := &models.Todo{
		ID:          1,
		Title:       "New Title",
		Description: "New Description",
		Priority:    "high",
	}

	// Chain Return calls for GetByID - first call returns existing, second returns updated
	mockTodoRepo.On("GetByID", 1).Return(existingTodo, nil).Once().Return(updatedTodo, nil).Once()
	mockTodoRepo.On("Update", mock.Anything).Return(nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.Update(updatedTodo)

	assert.NoError(t, err)
	assert.Equal(t, "New Title", result.Title)
	assert.Equal(t, "high", result.Priority)
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_Update_InvalidID(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	todo := &models.Todo{ID: 0, Title: "Test"}

	result, err := service.Update(todo)

	assert.Error(t, err)
	assert.Equal(t, "invalid todo id", err.Error())
	assert.Nil(t, result)
}

func TestTodoService_Update_EmptyTitle(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	todo := &models.Todo{ID: 1, Title: ""}

	result, err := service.Update(todo)

	assert.Error(t, err)
	assert.Equal(t, "todo title is required", err.Error())
	assert.Nil(t, result)
}

func TestTodoService_Update_InvalidPriority(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	todo := &models.Todo{ID: 1, Title: "Test", Priority: "invalid"}

	result, err := service.Update(todo)

	assert.Error(t, err)
	assert.Equal(t, "invalid priority. must be: high, medium, or low", err.Error())
	assert.Nil(t, result)
}

func TestTodoService_Update_InvalidCategory(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	existingTodo := &models.Todo{
		ID:     1,
		Title:  "Test",
	}

	catID := 999
	updateTodo := &models.Todo{
		ID:         1,
		Title:      "Test",
		CategoryID: &catID,
	}

	mockTodoRepo.On("GetByID", 1).Return(existingTodo, nil).Once()
	mockCategorySvc.On("IsCategoryExists", 999).Return(false).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.Update(updateTodo)

	assert.Error(t, err)
	assert.Equal(t, "category not found", err.Error())
	assert.Nil(t, result)
}

func TestTodoService_Delete_Success(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	todo := &models.Todo{ID: 1, Title: "Test"}

	mockTodoRepo.On("GetByID", 1).Return(todo, nil).Once()
	mockTodoRepo.On("Delete", 1).Return(nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	err := service.Delete(1)

	assert.NoError(t, err)
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_Delete_InvalidID(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	err := service.Delete(0)

	assert.Error(t, err)
	assert.Equal(t, "invalid todo id", err.Error())
}

func TestTodoService_Delete_NotFound(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	mockTodoRepo.On("GetByID", 999).Return(nil, errors.New("record not found")).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	err := service.Delete(999)

	assert.Error(t, err)
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_ToggleComplete_ToTrue(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	existingTodo := &models.Todo{
		ID:        1,
		Title:     "Test",
		Completed: false,
	}

	updatedTodo := &models.Todo{
		ID:        1,
		Title:     "Test",
		Completed: true,
	}

	mockTodoRepo.On("GetByID", 1).Return(existingTodo, nil).Once()
	mockTodoRepo.On("ToggleComplete", 1).Return(nil).Once()
	mockTodoRepo.On("GetByID", 1).Return(updatedTodo, nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.ToggleComplete(1)

	assert.NoError(t, err)
	assert.True(t, result.Completed)
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_ToggleComplete_ToFalse(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	existingTodo := &models.Todo{
		ID:        1,
		Title:     "Test",
		Completed: true,
	}

	updatedTodo := &models.Todo{
		ID:        1,
		Title:     "Test",
		Completed: false,
	}

	mockTodoRepo.On("GetByID", 1).Return(existingTodo, nil).Once()
	mockTodoRepo.On("ToggleComplete", 1).Return(nil).Once()
	mockTodoRepo.On("GetByID", 1).Return(updatedTodo, nil).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.ToggleComplete(1)

	assert.NoError(t, err)
	assert.False(t, result.Completed)
	mockTodoRepo.AssertExpectations(t)
}

func TestTodoService_ToggleComplete_InvalidID(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.ToggleComplete(0)

	assert.Error(t, err)
	assert.Equal(t, "invalid todo id", err.Error())
	assert.Nil(t, result)
}

func TestTodoService_ToggleComplete_NotFound(t *testing.T) {
	mockTodoRepo := new(MockTodoRepository)
	mockCategorySvc := new(MockCategoryServiceForTodo)

	mockTodoRepo.On("GetByID", 999).Return(nil, errors.New("record not found")).Once()

	service := NewTodoService(mockTodoRepo, mockCategorySvc)

	result, err := service.ToggleComplete(999)

	assert.Error(t, err)
	assert.Nil(t, result)
	mockTodoRepo.AssertExpectations(t)
}

func ptrToInt(i int) *int {
	return &i
}