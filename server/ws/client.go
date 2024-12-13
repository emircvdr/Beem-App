package ws

import (
	"log"

	"github.com/gofiber/contrib/websocket"
)

type Client struct {
	Conn *websocket.Conn
	Message chan *Message
	ID string `json:"id"`
	RoomId string `json:"room_id"`
	Username string `json:"username"`
}

type Message struct {
	Content string `json:"content"`
	RoomId string `json:"room_id"`
	Username string `json:"username"`
}

func (c *Client) WriteMessage() {
	defer func() {
		c.Conn.Close()
	}()

	for {
		msg, ok := <- c.Message
		if !ok {
			return
		}

		c.Conn.WriteJSON(msg)
	}
}

func (c *Client) ReadMessage(hub *Hub) {
	defer func() {
		hub.Unregister <- c
		c.Conn.Close()
	}()

	for {
		_, m, err :=c.Conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		msg := &Message{
			Content: string(m),
			RoomId: c.RoomId,
			Username: c.Username,
		}

		hub.Broadcast <- msg
	}
}