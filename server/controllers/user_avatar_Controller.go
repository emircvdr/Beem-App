package controllers

import (
	"fmt"
	"os"
	"path/filepath"
	"server/database"
	"server/models"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)



func UploadAvatarHandler(c *fiber.Ctx) error {
	userIDStr := c.Params("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil || userID == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid user ID")
	}

	// Retrieve the file from the form
	file, err := c.FormFile("avatar")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Failed to retrieve file")
	}

	// Check file type
	fileType := file.Header.Get("Content-Type")
	if fileType != "image/png" && fileType != "image/jpeg" {
		return c.Status(fiber.StatusUnsupportedMediaType).SendString("Only PNG and JPEG are allowed")
	}

	// Create uploads directory if not exists
	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		err := os.Mkdir(uploadDir, os.ModePerm)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to create uploads directory")
		}
	}

	// Generate file path
	fileName := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
	filePath := filepath.Join(uploadDir, fileName)

	// Save the file to disk
	if err := c.SaveFile(file, filePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to save file")
	}

	// Save file information to database
	avatar := models.UserAvatar{
		UserID:   uint(userID),
		FilePath: filePath,
		FileName: file.Filename,
		FileType: fileType,
		FileSize: file.Size,
	}
	if err := database.DB.Create(&avatar).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to save avatar to database")
	}

	// Response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Avatar loaded successfully",
		"avatar":  avatar,
	})
}

func GetAvatarHandler(c *fiber.Ctx) error {
	// Kullanıcı ID'sini route'tan al
	userIDStr := c.Params("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil || userID <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	// Veritabanından avatarı al
	var avatar models.UserAvatar
	if err := database.DB.Where("user_id = ?", userID).First(&avatar).Error; err != nil {
		// Log hata
		fmt.Printf("Error retrieving avatar: %v\n", err)

		if err == gorm.ErrRecordNotFound {
			// Eğer kayıt bulunamazsa özel hata döndür
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Avatar not found",
			})
		}
		// Diğer hata durumlarını kontrol et
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to retrieve avatar: %v", err),
		})
	}

	// Başarılı yanıt
	return c.Status(fiber.StatusOK).JSON(avatar)
}



