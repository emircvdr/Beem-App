package models

type UserProfile struct {
	ID           int    `json:"id"`
	UserID       int    `json:"user_id"`  
	Username    string `json:"username" gorm:"unique"` 
	Job        *string `json:"job"`         
	LinkedIn     *string `json:"linked_in"`
	Github       *string `json:"github"`
	Instagram    *string `json:"instagram"`
	Mail 	   *string `json:"mail"`
	Phone        *string `json:"phone"`
	
}