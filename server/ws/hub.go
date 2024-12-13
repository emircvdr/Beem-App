package ws


type Room struct {
	Id string `json:"id"`
	Name string `json:"name"`
	Clients map[string]*Client `json:"clients"`
}
type Hub struct {
	Rooms map[string]*Room
	Register chan *Client
	Unregister chan *Client
	Broadcast chan *Message
}

func NewHub() *Hub {
	return &Hub{
		Rooms: make(map[string]*Room),
		Register: make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast: make(chan *Message, 5),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			room, ok := h.Rooms[client.RoomId]
			if !ok {
				room = &Room{
					Id:      client.RoomId,
					Name:    "",
					Clients: make(map[string]*Client),
				}
				h.Rooms[client.RoomId] = room
			}
			room.Clients[client.ID] = client

		case message := <-h.Broadcast:
			room, ok := h.Rooms[message.RoomId]
			if ok {
				for _, client := range room.Clients {
					client.Message <- message
				}
			}
		}
	}
}
