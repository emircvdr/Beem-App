package ws

import (
	"server/database"
	"server/models"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	hub *Hub
}

func NewHandler(h *Hub) *Handler {
	return &Handler{
		hub: h,
	}
}

type CreateRoomRequest struct {
	ID      string `json:"id" gorm:"primaryKey"`
	Name    string `json:"name"`
	User1ID string `json:"user1Id"`
	User2ID string `json:"user2Id"`
}

func (h *Handler) CreateRoom(c *fiber.Ctx) error {
	var req CreateRoomRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	room := models.Room{
		ID : 	req.ID,
		Name:    req.Name,
		User1ID: req.User1ID,
		User2ID: req.User2ID,
	}

	if err := database.DB.Create(&room).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save room to database",
		})
	}

	if err := database.DB.First(&room, "id = ?", req.ID ).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Room already exists",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Room created successfully",
		"room":    room,
	})
}

func (h *Handler) JoinRoom(c *fiber.Ctx) error {
    // WebSocket bağlantısı kontrolü
    if websocket.IsWebSocketUpgrade(c) {
        roomId := c.Params("roomId")
        
        // roomId'nin geçerli olup olmadığını kontrol et
        if roomId == "" {
            return c.Status(fiber.StatusBadRequest).SendString("Geçersiz veya eksik roomId")
        }
        
        // WebSocket bağlantısı ise `WebSocketHandler`'a yönlendir
        return websocket.New(func(conn *websocket.Conn) {
            h.WebSocketHandler(conn, roomId)
        })(c)
    }

    return c.Status(fiber.StatusUpgradeRequired).SendString("WebSocket bağlantısı gerekli")
}


func (h *Handler) WebSocketHandler(c *websocket.Conn, roomId string) {
	defer c.Close()

	clientId := c.Query("clientId")
	username := c.Query("username")

	// Odayı kontrol et
	var room models.Room
	if err := database.DB.First(&room, "id = ?", roomId).Error; err != nil {
		c.WriteMessage(websocket.TextMessage, []byte("Room not found"))
		return
	}

	// Kullanıcı doğrulama
	if room.User1ID != clientId && room.User2ID != clientId {
		c.WriteMessage(websocket.TextMessage, []byte("Unauthorized"))
		return
	}

	// Yeni kullanıcı oluştur ve Hub'a ekle
	client := &Client{
		Conn:     c,
		Message:  make(chan *Message, 10),
		ID:       clientId,
		RoomId:   roomId,
		Username: username,
	}

	// Kullanıcı girdi mesajı oluştur
	joinMessage := &Message{
		Content:  username + " joined the room.",
		RoomId:   roomId,
		Username: username,
	}

	// Hub işlemleri
	h.hub.Register <- client
	h.hub.Broadcast <- joinMessage

	// Mesaj okuma ve yazma işlemlerini başlat
	go client.WriteMessage()
	client.ReadMessage(h.hub)
}

type RoomRes struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (h *Handler) GetRooms(c *fiber.Ctx) error {
	var rooms []models.Room
	if err := database.DB.Find(&rooms).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get rooms from database",
		})
	}
	return c.JSON(rooms)
}

type ClientRes struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

func (h *Handler) GetRoomClients(c *fiber.Ctx) error {
	var clients []ClientRes
	roomId := c.Params("roomId")

	if _, ok := h.hub.Rooms[roomId]; !ok {
		clients = make([]ClientRes, 0)
		return c.JSON(clients)
	}

	for _, client := range h.hub.Rooms[roomId].Clients {
		clients = append(clients, ClientRes{
			ID:       client.ID,
			Username: client.Username,
		})
	}

	return c.JSON(clients)
}
