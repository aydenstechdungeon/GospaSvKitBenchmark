package routes

import (
	"database/sql"
	"log"
)

var DB *sql.DB

type Todo struct {
	ID        int    `json:"id"`
	Text      string `json:"text"`
	Completed int    `json:"completed"`
}

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "./todos.sqlite")
	if err != nil {
		log.Fatal(err)
	}

	if _, err := DB.Exec(`
		CREATE TABLE IF NOT EXISTS todos (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			text TEXT NOT NULL,
			completed INTEGER DEFAULT 0
		)
	`); err != nil {
		log.Fatal(err)
	}
}

func GetTodos() []Todo {
	rows, err := DB.Query("SELECT id, text, completed FROM todos ORDER BY id DESC")
	if err != nil {
		return nil
	}
	defer rows.Close()

	todos := []Todo{}
	for rows.Next() {
		var t Todo
		rows.Scan(&t.ID, &t.Text, &t.Completed)
		todos = append(todos, t)
	}
	return todos
}
