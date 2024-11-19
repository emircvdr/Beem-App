package routes

import (
	"server/controllers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	// auth routes
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Get("/api/user", controllers.User)
	app.Post("/api/logout", controllers.Logout)
	// workplace routes
	app.Post("/api/createWorkplace", controllers.CreateWorkplace)
	app.Get("/api/workplaces/:admin_id", controllers.GetWorkplacesByAdminId)
}