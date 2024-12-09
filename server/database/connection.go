package database

import (
	"server/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	connection, err := gorm.Open(mysql.Open("root:rootsecretpassword@/mydatabase"), &gorm.Config{})

	if err != nil {
		panic("Could not connect to the database")
	}
	DB = connection

	connection.AutoMigrate(&models.User{})
	connection.AutoMigrate(&models.Workplace{})
	connection.AutoMigrate(&models.UserProfile{})
	connection.AutoMigrate(&models.FriendRequest{})
	connection.AutoMigrate(&models.Friend{})
	connection.AutoMigrate(&models.UserAvatar{})
}
