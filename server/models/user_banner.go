package models


type UserBanner struct {
    ID           uint   `gorm:"primaryKey"`
    UserID       uint   `gorm:"unique"`
    FilePath     string `gorm:"not null"`
    FileName     string `gorm:"not null"`
    FileType     string `gorm:"not null"`
    FileSize     int64  `gorm:"not null"`
    CroppedWidth int    `gorm:"not null"`
    CroppedHeight int   `gorm:"not null"`
    CroppedX     int    `gorm:"not null"`
    CroppedY     int    `gorm:"not null"`
}
