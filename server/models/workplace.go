package models

type Workplace struct {
	Id 	 uint   `json:"id"`
	Name string `json:"name"`
	AdminId   int `json:"admin_id"`
	Private bool `json:"private"`
	InviteCode string `json:"invite_code"`
}