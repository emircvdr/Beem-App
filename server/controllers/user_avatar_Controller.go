package controllers

import (
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"server/database"
	"server/models"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)



func UploadAvatarHandler(c *fiber.Ctx) error {
	userIDStr := c.Params("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil || userID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	base64Data := c.FormValue("avatar")
	if base64Data == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing avatar data"})
	}

	parts := strings.SplitN(base64Data, ",", 2)
	if len(parts) != 2 || !strings.HasPrefix(parts[0], "data:image/") {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid base64 image data"})
	}

	fileType := strings.TrimPrefix(strings.Split(parts[0], ";")[0], "data:")
	decodedData, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to decode base64 image data"})
	}

	if len(parts[1]) > (10 * 1024 * 1024) { // 10 MB sınırı
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Image size exceeds the 10 MB limit"})
	}

	allowedTypes := map[string]bool{"image/png": true, "image/jpeg": true}
	if !allowedTypes[fileType] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Unsupported image type"})
	}

	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		if err := os.MkdirAll(uploadDir, 0755); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create uploads directory"})
		}
	}

	fileName := fmt.Sprintf("%d_avatar.%s", time.Now().Unix(), strings.Split(fileType, "/")[1])
	filePath := filepath.Join(uploadDir, fileName)

	if err := os.WriteFile(filePath, decodedData, 0644); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save image file"})
	}

	croppedWidth, _ := strconv.Atoi(c.FormValue("croppedWidth"))
	croppedHeight, _ := strconv.Atoi(c.FormValue("croppedHeight"))
	croppedX, _ := strconv.Atoi(c.FormValue("croppedX"))
	croppedY, _ := strconv.Atoi(c.FormValue("croppedY"))

	

	var existingAvatar models.UserAvatar
	if err := database.DB.Where("user_id = ?", userID).First(&existingAvatar).Error; err == nil {
		os.Remove(existingAvatar.FilePath)
		existingAvatar = models.UserAvatar{
			UserID:        uint(userID),
			FilePath:      filePath,
			FileName:      fileName,
			FileType:      fileType,
			FileSize:      int64(len(decodedData)),
			CroppedWidth:  croppedWidth,
			CroppedHeight: croppedHeight,
			CroppedX:      croppedX,
			CroppedY:      croppedY,
		}
		if err := database.DB.Save(&existingAvatar).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update avatar in database"})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Avatar updated successfully", "avatar": existingAvatar})
	}

	avatar := models.UserAvatar{
		UserID:        uint(userID),
		FilePath:      filePath,
		FileName:      fileName,
		FileType:      fileType,
		FileSize:      int64(len(decodedData)),
		CroppedWidth:  croppedWidth,
		CroppedHeight: croppedHeight,
		CroppedX:      croppedX,
		CroppedY:      croppedY,
	}
	if err := database.DB.Create(&avatar).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save avatar to database"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Avatar uploaded successfully", "avatar": avatar})
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

func DeleteAvatarHandler(c *fiber.Ctx) error {
	userIDStr := c.Params("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil || userID <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	var avatar models.UserAvatar
	if err := database.DB.Where("user_id = ?", userID).First(&avatar).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Avatar not found"})
	}

	os.Remove(avatar.FilePath)
	database.DB.Delete(&avatar)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Avatar deleted successfully"})
}

func GetAllAvatarHandler(c *fiber.Ctx) error {
	var avatars []models.UserAvatar
	if err := database.DB.Find(&avatars).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve avatars"})
	}

	return c.Status(fiber.StatusOK).JSON(avatars)
}



