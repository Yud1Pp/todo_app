package main

import (
	"fmt"
	"log"

	"todo-app-backend/internal/config"
	"todo-app-backend/internal/handlers"
	"todo-app-backend/internal/middleware"
	"todo-app-backend/internal/models"
	"todo-app-backend/internal/repository"
	"todo-app-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := config.ConnectDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	err = db.AutoMigrate(&models.Category{}, &models.Todo{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get SQL DB: %v", err)
	}
	defer sqlDB.Close()

	categoryRepo := repository.NewCategoryRepository(db)
	categoryService := services.NewCategoryService(categoryRepo)
	categoryHandler := handlers.NewCategoryHandler(categoryService)

	todoRepo := repository.NewTodoRepository(db)
	todoService := services.NewTodoService(todoRepo, categoryService)
	todoHandler := handlers.NewTodoHandler(todoService)

	router := gin.Default()

	router.Use(middleware.CORS())

	api := router.Group("/api")
	{
		api.GET("/todos", todoHandler.GetAll)
		api.POST("/todos", todoHandler.Create)
		api.GET("/todos/:id", todoHandler.GetByID)
		api.PUT("/todos/:id", todoHandler.Update)
		api.DELETE("/todos/:id", todoHandler.Delete)
		api.PATCH("/todos/:id/complete", todoHandler.ToggleComplete)

		api.GET("/categories", categoryHandler.GetAll)
		api.POST("/categories", categoryHandler.Create)
		api.GET("/categories/:id", categoryHandler.GetByID)
		api.PUT("/categories/:id", categoryHandler.Update)
		api.DELETE("/categories/:id", categoryHandler.Delete)
	}

	fmt.Println("Database connected successfully!")
	log.Printf("Server running on port %s", cfg.Port)
	log.Fatal(router.Run(":" + cfg.Port))
}