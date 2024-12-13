package main

import (
	"server/database"
	"server/routes"
	"server/ws"


	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()
	
    app := fiber.New()


	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000", 
		AllowCredentials: true,
	}))

	hub := ws.NewHub()
	wsHandler := ws.NewHandler(hub)

	app.Post("/ws/create-room", wsHandler.CreateRoom)
	app.Get("/ws/join-room/:roomId", wsHandler.JoinRoom)
	app.Get("/ws/get-rooms", wsHandler.GetRooms)
	app.Get("/ws/get-room-clients/:roomId", wsHandler.GetRoomClients)

	go hub.Run()



	 

	routes.Setup(app)
    
	app.Listen(":8000")

  
}