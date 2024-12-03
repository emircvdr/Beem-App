package controllers

import (
	"server/database"
	"server/models"

	"github.com/gofiber/fiber/v2"
)


func CreateFriendRequest(c *fiber.Ctx) error {
	var friendRequest models.FriendRequest

	if err := c.BodyParser(&friendRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if friendRequest.Status == "" {
		friendRequest.Status = "pending"
	}

	if friendRequest.SenderId == 0 || friendRequest.ReceiverId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Sender ID and Receiver ID are required",
		})
	}

	if friendRequest.Status != "pending" && friendRequest.Status != "accepted" && friendRequest.Status != "rejected" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid status",
		})
	}

	database.DB.Create(&friendRequest)

	return c.Status(fiber.StatusOK).JSON(friendRequest)
}


func GetFriendRequestWithSenderandReceiverId(c *fiber.Ctx) error {
	senderId := c.Params("sender_id")
	receiverId := c.Params("receiver_id")

	if senderId == "0" || receiverId == "0" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid sender or receiver ID",
		})
	}

	var friendRequest models.FriendRequest
	result := database.DB.Where(
		"(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
		senderId, receiverId, receiverId, senderId,
	).First(&friendRequest)

	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"exists": false,
			"error":  "No friend request found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"exists":   true,
		"status":   friendRequest.Status,
		"senderId": friendRequest.SenderId,
		"receiverId": friendRequest.ReceiverId,
	})
}


func CancelFriendRequest(c *fiber.Ctx) error {
	senderId := c.Params("sender_id")
	receiverId := c.Params("receiver_id")

	if senderId == "0" || receiverId == "0" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid sender or receiver ID",
		})
	}

	database.DB.Where("sender_id = ? AND receiver_id = ?", senderId, receiverId).Delete(&models.FriendRequest{})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Friend request cancelled",
	})
}

func GetPendingFriendRequests(c *fiber.Ctx) error {
	senderId := c.Params("sender_id")

	if senderId == "0" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid sender ID",
		})
	}

	var friendRequests []models.FriendRequest
	database.DB.Where("sender_id = ? AND status = ?", senderId, "pending").Find(&friendRequests)

	return c.Status(fiber.StatusOK).JSON(friendRequests)
}

func GetFriendRequestsByReceiverId(c *fiber.Ctx) error {
	receiverId := c.Params("receiver_id")

	if receiverId == "0" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid receiver ID",
		})
	}

	var friendRequests []models.FriendRequest
	database.DB.Where("receiver_id = ? AND status = ?", receiverId, "pending").Find(&friendRequests)

	return c.Status(fiber.StatusOK).JSON(friendRequests)
}
