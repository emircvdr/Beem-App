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

	if workplaceRequest.WorkplaceId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Workplace ID is required",
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

func GetWorkplaceReqWithReceiverId(c *fiber.Ctx) error {
	receiverId := c.Params("receiver_id")

	if receiverId == "0" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid sender ID",
		})
	}
	var workplaceRequest []models.WorkplaceRequest
	database.DB.Where("receiver_id = ? AND status = ?", receiverId, "pending").Find(&workplaceRequest)
	return c.Status(fiber.StatusOK).JSON(workplaceRequest)
}

func AcceptWorkplaceReq(c *fiber.Ctx) error {
	id := c.Params("id")

	database.DB.Model(&models.WorkplaceRequest{}).Where("id = ?", id).Update("status", "accepted")

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Workplace request accepted",
	})
}

func RejecetWorkplaceReq(c *fiber.Ctx) error {
	id := c.Params("id")

	database.DB.Where("id = ?", id).Delete(&models.WorkplaceRequest{})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Workplace request rejected",
	})
}

func GetWorkplaceReqWithUserId(c *fiber.Ctx) error {
	userId := c.Params("user_id")

	if userId == "0" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	var workplaceMember []models.WorkplaceMember
	database.DB.Where("user_id = ?", userId).Find(&workplaceMember)

	return c.Status(fiber.StatusOK).JSON(workplaceMember)
}

func GetWorkplaceMembers(c *fiber.Ctx) error {
	workplaceId := c.Params("workplace_id")

	if workplaceId == "0" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid workplace ID",
		})
	}

	var workplaceMember []models.WorkplaceMember
	database.DB.Where("workplace_id = ?", workplaceId).Find(&workplaceMember)

	return c.Status(fiber.StatusOK).JSON(workplaceMember)
}

func DeleteMember(c *fiber.Ctx) error {
	id := c.Params("id")

	database.DB.Where("id = ?", id).Delete(&models.WorkplaceMember{})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Workplace member deleted",
	})
}

func UpdateMemberRole(c *fiber.Ctx) error {
	id := c.Params("id")

	var updateRole struct {
		Role string `json:"role"`
	}

	if err := c.BodyParser(&updateRole); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	database.DB.Model(&models.WorkplaceMember{}).Where("id = ?", id).Update("role", updateRole.Role)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Workplace member role updated",
	})
}