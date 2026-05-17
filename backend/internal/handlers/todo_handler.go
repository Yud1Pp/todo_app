package handlers

import (
	"net/http"
	"strconv"
	"time"

	"todo-app-backend/internal/models"
	"todo-app-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type TodoHandler struct {
	service *services.TodoService
}

func NewTodoHandler(service *services.TodoService) *TodoHandler {
	return &TodoHandler{service: service}
}

type CreateTodoRequest struct {
	Title       string     `json:"title" binding:"required"`
	Description string     `json:"description"`
	CategoryID  *int       `json:"category_id"`
	Priority    string     `json:"priority"`
	DueDate     *time.Time `json:"due_date"`
}

type UpdateTodoRequest struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Completed   *bool      `json:"completed"`
	CategoryID  *int       `json:"category_id"`
	Priority    string     `json:"priority"`
	DueDate     *time.Time `json:"due_date"`
}

func (h *TodoHandler) Create(c *gin.Context) {
	var req CreateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	todo := &models.Todo{
		Title:       req.Title,
		Description: req.Description,
		CategoryID:  req.CategoryID,
		Priority:    req.Priority,
		DueDate:     req.DueDate,
	}

	result, err := h.service.Create(todo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, result)
}

func (h *TodoHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "6"))
	search := c.Query("search")
	filterBy := c.Query("filterBy")
	filterValue := c.Query("filterValue")

	todos, total, err := h.service.GetAll(page, limit, search, filterBy, filterValue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}

	c.JSON(http.StatusOK, gin.H{
		"data": todos,
		"pagination": gin.H{
			"current_page": page,
			"per_page":     limit,
			"total":        total,
			"total_pages":  totalPages,
		},
	})
}

func (h *TodoHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	todo, err := h.service.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "todo not found"})
		return
	}

	c.JSON(http.StatusOK, todo)
}

func (h *TodoHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	existingTodo, err := h.service.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "todo not found"})
		return
	}

	var req UpdateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Title != "" {
		existingTodo.Title = req.Title
	}
	if req.Description != "" {
		existingTodo.Description = req.Description
	}
	if req.Completed != nil {
		existingTodo.Completed = *req.Completed
	}
	if req.CategoryID != nil {
		existingTodo.CategoryID = req.CategoryID
	}
	if req.Priority != "" {
		existingTodo.Priority = req.Priority
	}
	if req.DueDate != nil {
		existingTodo.DueDate = req.DueDate
	}

	result, err := h.service.Update(existingTodo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *TodoHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	err = h.service.Delete(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "todo deleted successfully"})
}

func (h *TodoHandler) ToggleComplete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	todo, err := h.service.ToggleComplete(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, todo)
}