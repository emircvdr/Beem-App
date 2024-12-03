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
	app.Get("/api/getUserWithId/:id", controllers.GetUserWithId)
	app.Post("/api/logout", controllers.Logout)
	app.Get("/api/allUsers", controllers.GetAllUsers)
	// workplace routes
	app.Post("/api/createWorkplace", controllers.CreateWorkplace)
	app.Get("/api/workplaces/:admin_id", controllers.GetWorkplacesByAdminId)

	// user profile routes
	app.Post("/api/createUserProfile", controllers.CreateUserProfile)
	app.Get("/api/userProfiles/:user_id", controllers.GetUserProfileWithUserId)
	app.Put("/api/updateUserProfile/:user_id", controllers.UpdateUserProfile)

	// friend request routes
	app.Post("/api/createFriendRequest", controllers.CreateFriendRequest)
	app.Get("/api/getFriendRequestWithSenderandReceiverId/:sender_id/:receiver_id", controllers.GetFriendRequestWithSenderandReceiverId)
	app.Delete("/api/cancelFriendRequest/:sender_id/:receiver_id", controllers.CancelFriendRequest)
	app.Get("/api/getPendingFriendRequests/:sender_id", controllers.GetPendingFriendRequests)
	app.Get("/api/getFriendRequestsByReceiverId/:receiver_id", controllers.GetFriendRequestsByReceiverId)
	app.Put("/api/acceptFriendRequestWithId/:id", controllers.AcceptFriendRequestWithId)

	// friends routes
	app.Post("/api/acceptFriend", controllers.AcceptFriend)
}
