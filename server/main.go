package main

import (
	"log"
	"server/database"
	"server/routes"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type client struct {
	isClosing bool
	mu        sync.Mutex
}

var (
	clients    = make(map[*websocket.Conn]*client) // Note: although large maps with pointer-like types (e.g. strings) as keys are slow, using pointers themselves as keys is acceptable and fast
	register   = make(chan *websocket.Conn)
	broadcast  = make(chan string)
	unregister = make(chan *websocket.Conn)
)

func runHub() {
	for {
		select {
		case connection := <-register:
			clients[connection] = &client{}
			log.Println("connection registered")

		case message := <-broadcast:
			log.Println("message received:", message)
			// Send the message to all clients
			for connection, c := range clients {
				go func(connection *websocket.Conn, c *client) { // send to each client in parallel so we don't block on a slow client
					c.mu.Lock()
					defer c.mu.Unlock()
					if c.isClosing {
						return
					}
					if err := connection.WriteMessage(websocket.TextMessage, []byte(message)); err != nil {
						c.isClosing = true
						log.Println("write error:", err)

						connection.WriteMessage(websocket.CloseMessage, []byte{})
						connection.Close()
						unregister <- connection
					}
				}(connection, c)
			}

		case connection := <-unregister:
			// Remove the client from the hub
			delete(clients, connection)

			log.Println("connection unregistered")
		}
	}
}


func main() {
	database.Connect()
	
    app := fiber.New()


	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000", 
		AllowCredentials: true,
	}))

	
	routes.Setup(app)

	app.Use(func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) { // Returns true if the client requested upgrade to the WebSocket protocol
			return c.Next()
		}
		return c.SendStatus(fiber.StatusUpgradeRequired)
	})

	

	app.Get("/ws/:roomId", websocket.New(func(c *websocket.Conn) {
		// When the function returns, unregister the client and close the connection
		defer func() {
			unregister <- c
			c.Close()
		}()

		// Register the client
		register <- c

		for {
			messageType, message, err := c.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Println("read error:", err)
				}

				return // Calls the deferred function, i.e. closes the connection on error
			}

			if messageType == websocket.TextMessage {
				// Broadcast the received message
				broadcast <- string(message)
			} else {
				log.Println("websocket message received of type", messageType)
			}
		}
	}))
	
	go runHub()
	
    
	log.Fatal(app.Listen(":8000"))

  
}