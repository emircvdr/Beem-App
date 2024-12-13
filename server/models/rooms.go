package models

type Room struct {
	ID      string `json:"id" gorm:"primaryKey"`
	Name    string `json:"name"`
	User1ID string `json:"user1Id"`
	User2ID string `json:"user2Id"`
}
