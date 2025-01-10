package routes

import (
	"server/controllers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Static("/uploads", "./uploads")
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
	app.Get("/api/workplaceWithId/:id", controllers.GetWorkplaceWithId)
	app.Delete("/api/deleteWorkplace/:id", controllers.DeleteWorkplace)
	app.Put("/api/updateWorkplace/:id", controllers.UpdateWorkplaceName)
	app.Put("/api/updateWorkplaceVisibility/:id", controllers.UpdateWorkplaceVisibility)
	app.Get("/api/getAllWorkplaces", controllers.GetAllWorkplaces)

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
	app.Delete("/api/rejectFriendRequestWithId/:id", controllers.RejectFriendRequestWithId)
	app.Get("/api/getFriendRequestsBySenderId/:sender_id", controllers.GetFriendRequestsBySenderId)

	// friends routes
	app.Post("/api/acceptFriend", controllers.AcceptFriend)
	app.Get("/api/getFriends/:user_id", controllers.GetFriends)
	app.Delete("/api/deleteFriend/:id", controllers.DeleteFriend)

	// user avatar routes
	app.Post("/api/uploadAvatar/:user_id", controllers.UploadAvatarHandler)
	app.Get("/api/getAvatar/:user_id", controllers.GetAvatarHandler)
	app.Delete("/api/deleteAvatar/:user_id", controllers.DeleteAvatarHandler)
	app.Get("/api/getAllAvatar", controllers.GetAllAvatarHandler)

	// user banner routes
	app.Post("/api/uploadBanner/:user_id", controllers.UploadBannerHandler)
	app.Get("/api/getBanner/:user_id", controllers.GetBannerHandler)
	app.Delete("/api/deleteBanner/:user_id", controllers.DeleteBannerHandler)


	// workplace member routes
	app.Post("/api/createWorkplaceMember", controllers.CreateWorkplaceMember)
	app.Get("/api/getWorkplaceMember/:user_id", controllers.GetWorkplaceReqWithUserId)
	app.Get("/api/getWorkplaceMemberWithWorkplaceId/:workplace_id", controllers.GetWorkplaceMembers)
	app.Delete("/api/deleteWorkplaceMember/:id", controllers.DeleteMember)
	app.Put("/api/updateWorkplaceMemberRole/:id", controllers.UpdateMemberRole)
	// workplace request routes
	app.Post("/api/createWorkplaceRequest", controllers.CreateWorkplaceRequest)
	app.Get("/api/getWorkplaceReqWithSenderId/:sender_id", controllers.GetWorkplaceReqWithSenderId)
	app.Delete("/api/cancelWorkplaceReq/:sender_id/:receiver_id", controllers.CancelWorkplaceInvite)
	app.Get("/api/getWorkplaceReqWithReceiverId/:receiver_id", controllers.GetWorkplaceReqWithReceiverId)
	app.Put("/api/acceptWorkplaceReq/:id", controllers.AcceptWorkplaceReq)
	app.Delete("/api/rejectWorkplaceReq/:id", controllers.RejectWorkplaceReq)


	// room routes
	app.Post("/api/createRoom", controllers.CreateRoom)
	app.Get("/api/getRooms", controllers.GetRooms)
	app.Get("/api/getRoomsWithId/:id", controllers.GetRoomsWithId)

}
