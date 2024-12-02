package models

import "time"

type FriendRequest struct {
	Id        uint   `json:"id"`
	SenderId  uint   `json:"sender_id"`
	ReceiverId uint   `json:"receiver_id"`
	Status     string `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
