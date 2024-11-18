package models

type User struct {
	Id 	 uint   `json:"id"`
	Fullname string `json:"fullname"`
	Email    string `json:"email" gorm:"unique"`
	Password []byte `json:"-"`


}