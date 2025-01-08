package controllers

import (
	"server/database"
	"server/models"

	"github.com/gofiber/fiber/v2"
)


func CreateWorkplaceMember(c *fiber.Ctx) error {
	var workplaceMember models.WorkplaceMember

	if err := c.BodyParser(&workplaceMember); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if workplaceMember.UserId  == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User ID and Workplace ID are required",
		})
	}

	if workplaceMember.WorkplaceId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Workplace ID is required",
		})
	}

	if err := database.DB.Create(&workplaceMember).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Could not create workplace member",
		})
	}

	return c.JSON(workplaceMember)
}

func CreateWorkplaceRequest(c *fiber.Ctx) error {
	var workplaceRequest models.WorkplaceRequest

	if err := c.BodyParser(&workplaceRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if workplaceRequest.Status == "" {
		workplaceRequest.Status = "pending"
	}

	if workplaceRequest.SenderId == 0 || workplaceRequest.ReceiverId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Sender ID and Receiver ID are required",
		})
	}

	if workplaceRequest.Status != "pending" && workplaceRequest.Status != "accepted" && workplaceRequest.Status != "rejected" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid status",
		})
	}

	database.DB.Create(&workplaceRequest)

	return c.Status(fiber.StatusOK).JSON(workplaceRequest)
}

func GetWorkplaceReqWithSenderId(c *fiber.Ctx) error {
	senderId := c.Params("sender_id")

	if senderId == "0" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid sender ID",
		})
	}
	var workplaceRequest []models.WorkplaceRequest
	database.DB.Where("sender_id = ? AND status = ?", senderId, "pending").Find(&workplaceRequest)
	return c.Status(fiber.StatusOK).JSON(workplaceRequest)
}

func CancelWorkplaceInvite(c *fiber.Ctx) error {
	senderId := c.Params("sender_id")
	receiverId := c.Params("receiver_id")

	if senderId == "0" || receiverId == "0" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid sender or receiver ID",
		})
	}

	database.DB.Where("sender_id = ? AND receiver_id = ?", senderId, receiverId).Delete(&models.WorkplaceRequest{})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Workplace request cancelled",
	})
}