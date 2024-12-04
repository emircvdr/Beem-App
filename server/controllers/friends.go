package controllers

import (
	"server/database"
	"server/models"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func IsDuplicateFriendError(err error) bool {
	return strings.Contains(err.Error(), "Duplicate entry")
}

func AcceptFriend(c *fiber.Ctx) error {
	var friend models.Friend

	if err := c.BodyParser(&friend); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if friend.UserId == 0 || friend.FriendId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User ID and Friend ID are required",
		})
	}
	if err := database.DB.Create(&friend).Error; err != nil {
		if IsDuplicateFriendError(err) {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Friend already exists",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create friend",
		})
	}
	return c.Status(fiber.StatusOK).JSON(friend)
}

func GetFriends(c *fiber.Ctx) error {
	userId := c.Params("user_id")
	var friends []models.Friend
	result := database.DB.Where("user_id = ? OR friend_id = ?", userId, userId).Find(&friends)

	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "No friends found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(friends)
}

func DeleteFriend(c *fiber.Ctx) error {
	id := c.Params("id")

	database.DB.Where("id = ?", id).Delete(&models.Friend{})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Friend request rejected",
	})
  

}
