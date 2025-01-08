package models



type WorkplaceRequest struct {
	Id        uint   `json:"id"`
	SenderId  uint   `json:"sender_id"`
	ReceiverId uint   `json:"receiver_id"`
	Status     string `json:"status"`
	WorkplaceId uint `json:"workplace_id"`
}
