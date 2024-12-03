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
