package models


type UserAvatar struct {
	ID        uint   `gorm:"primaryKey"`
	UserID    uint   `gorm:"unique"`
	FilePath  string `gorm:"not null"`
	FileName  string `gorm:"not null"`
	FileType  string `gorm:"not null"`
	FileSize  int64  `gorm:"not null"`
}
