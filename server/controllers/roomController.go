package controllers

import (
	"server/database"
	"server/models"

	"github.com/gofiber/fiber/v2"
)


func CreateRoom(c *fiber.Ctx) error {
	var room models.Room

	if err := c.BodyParser(&room); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	
	if room.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Name is required",
		})
	}

	var existingRoom models.Room
	if err := database.DB.First(&existingRoom, "ID=?", room.ID).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Room already exists",
		})
	}

	if err := database.DB.Create(&room).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create room",
		})
	}
	return c.Status(fiber.StatusOK).JSON(room)
}

func GetRooms(c *fiber.Ctx) error {
	var rooms []models.Room
	result := database.DB.Find(&rooms)

	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "No rooms found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(rooms)
}

func GetRoomsWithId(c *fiber.Ctx) error {
	id := c.Params("id")
	var room models.Room
	result := database.DB.First(&room, "ID=?", id)

	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "No room found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(room)
}