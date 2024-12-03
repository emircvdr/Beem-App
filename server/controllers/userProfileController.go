package controllers

import (
	"server/database"
	"server/models"

	"github.com/gofiber/fiber/v2"

	"strings"
)


func IsDuplicateEntryError(err error) bool {
	return strings.Contains(err.Error(), "Duplicate entry")
}

func CreateUserProfile(c *fiber.Ctx) error {
	var userProfile models.UserProfile

	if err := c.BodyParser(&userProfile); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Zorunlu alanları kontrol et
	if userProfile.UserID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User ID is required",
		})
	}
	if userProfile.Username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Username is required",
		})
	}

	if userProfile.Job == nil {
		userProfile.Job = nil 
	}

	if userProfile.LinkedIn == nil {
		userProfile.LinkedIn = nil
	}
	if userProfile.Github == nil {
		userProfile.Github = nil
	}
	if userProfile.Instagram == nil {
		userProfile.Instagram = nil
	}
	if userProfile.Mail == nil {
		userProfile.Mail = nil
	}
	if userProfile.Phone == nil {
		userProfile.Phone = nil
	}

	// Veritabanına kaydet
	if err := database.DB.Create(&userProfile).Error; err != nil {
		// Eğer benzersizlik hatası varsa
		if IsDuplicateEntryError(err) {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Username already exists",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create user profile",
		})
	}

	// Başarılı yanıt döndür
	return c.JSON(userProfile)
}

func GetUserProfileWithUserId(c *fiber.Ctx) error {
	// URL parametresinden user_id al
	userID := c.Params("user_id")

	// Kullanıcı profili veritabanından çek
	var userProfile models.UserProfile
	if err := database.DB.Where("user_id = ?", userID).First(&userProfile).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User profile not found",
		})
	}

	// Başarılı yanıt döndür
	return c.JSON(userProfile)
}

func UpdateUserProfile(c *fiber.Ctx) error {
	userID := c.Params("user_id")

	// Kullanıcı profili veritabanından çek
	var userProfile models.UserProfile
	if err := database.DB.Where("user_id = ?", userID).First(&userProfile).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User profile not found",
		})
	}

	// Gelen JSON veriyi doğrudan UserProfile modeline parse etmek
	var newProfile models.UserProfile

	// JSON veriyi ayrıştır
	if err := c.BodyParser(&newProfile); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Eğer image veya social_media gelmediyse varsayılan değerler atanır
	if userProfile.Job == nil {
		userProfile.Job = nil // Eğer yoksa, nil atanır
	}

	// Eğer social_media gelmediyse varsayılan olarak nil atanır
	if userProfile.LinkedIn == nil {
		userProfile.LinkedIn = nil // Eğer yoksa, nil atanır
	}
	if userProfile.Github == nil {
		userProfile.Github = nil // Eğer yoksa, nil atanır
	}
	if userProfile.Instagram == nil {
		userProfile.Instagram = nil // Eğer yoksa, nil atanır
	}
	if userProfile.Mail == nil {
		userProfile.Mail = nil // Eğer yoksa, nil atanır
	}
	if userProfile.Phone == nil {
		userProfile.Phone = nil // Eğer yoksa, nil atanır
	}

	// Veritabanına kaydet
	if err := database.DB.Model(&userProfile).Updates(&newProfile).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not update user profile",
		})
	}

	// Başarılı yanıt döndür
	return c.JSON(userProfile)
}