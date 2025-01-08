package models

type WorkplaceMember struct {
	Id 	 uint   `json:"id"`
	WorkplaceId uint `json:"workplace_id"`
	AdminId   int `json:"admin_id"`
	UserId uint `json:"user_id"`
	Role string `json:"role"`
}