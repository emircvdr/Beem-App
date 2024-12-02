package models

import "time"

type Friend struct {
	Id        uint   `json:"id"`
	UserId    uint   `json:"user_id"`
	FriendId  uint   `json:"friend_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
