package controllers

import (
	"server/database"
	"server/models"

	"github.com/gofiber/fiber/v2"
)



func CreateWorkplace(c *fiber.Ctx) error {

	var data map[string]interface{}

	// Parse incoming JSON body
	if err := c.BodyParser(&data); err != nil {
    return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
        "error": "Invalid request body",
    })
	}

	// Validate required fields
	name, ok := data["name"].(string)
	if !ok || name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Name is required",
		})
	}

	adminId, ok := data["admin_id"].(float64)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Admin ID is required",
		})
	}
	adminIdInt := int(adminId)
	
	private, ok := data["private"].(bool)
	if !ok {
		private = false // Varsayılan değer
	}

	// Create workplace instance
	workplace := models.Workplace{
		Name:    name,
		AdminId: adminIdInt,
		Private: private,
	}

	// Save to database
	if err := database.DB.Create(&workplace).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create workplace",
		})
	}

	// Return the created workplace as a response
	return c.JSON(workplace)
}

func GetWorkplacesByAdminId(c *fiber.Ctx) error {
    var workplaces []models.Workplace // Tüm workplace'leri tutacak bir dilim (slice) tanımlıyoruz.

    // admin_id'ye göre tüm workplace'leri buluyoruz
    adminId := c.Params("admin_id") // admin_id'yi URL parametresinden alıyoruz
    if err := database.DB.Where("admin_id = ?", adminId).Find(&workplaces).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Unable to fetch workplaces",
        })
    }

    // Bulunan workplace'leri JSON formatında döndürüyoruz
    return c.JSON(workplaces)
}

func GetWorkplaceWithId(c *fiber.Ctx) error {
	// URL parametresinden user_id al
	id := c.Params("id")

	// Kullanıcı profili veritabanından çek
	var workplace models.Workplace
	if err := database.DB.Where("id = ?", id).First(&workplace).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User profile not found",
		})
	}

	// Başarılı yanıt döndür
	return c.JSON(workplace)
}

func DeleteWorkplace(c *fiber.Ctx) error {
	id := c.Params("id")

	database.DB.Where("id = ?", id).Delete(&models.Workplace{})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Workplace deleted",
	})
  
}

func UpdateWorkplaceName(c *fiber.Ctx) error {
	id := c.Params("id")

	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	name, ok := data["name"].(string)
	if !ok || name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Name is required",
		})
	}

	database.DB.Model(&models.Workplace{}).Where("id = ?", id).Update("name", name)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Workplace name updated",
	})
}

func UpdateWorkplaceVisibility(c *fiber.Ctx) error {
	id := c.Params("id")

	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	private, ok := data["private"].(bool)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Visibility is required",
		})
	}

	database.DB.Model(&models.Workplace{}).Where("id = ?", id).Update("private", private)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Workplace visibility updated",
	})
}
