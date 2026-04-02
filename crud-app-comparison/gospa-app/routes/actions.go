package routes

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/aydenstechdungeon/gospa/routing"
)

func init() {
	routing.RegisterRemoteAction("createTodo", func(ctx context.Context, rc routing.RemoteContext, input any) (any, error) {
		text, ok := input.(string)
		if !ok || text == "" {
			return nil, errors.New("invalid text")
		}
		_, err := DB.Exec("INSERT INTO todos (text) VALUES (?)", text)
		return nil, err
	})

	routing.RegisterRemoteAction("toggleTodo", func(ctx context.Context, rc routing.RemoteContext, input any) (any, error) {
		var id int
		switch v := input.(type) {
		case float64:
			id = int(v)
		case int:
			id = v
		case string:
			fmt.Sscanf(v, "%d", &id)
		case json.Number:
			id64, _ := v.Int64()
			id = int(id64)
		default:
			return nil, fmt.Errorf("invalid id: expected number or string, got %T", input)
		}

		var completed int
		if err := DB.QueryRow("SELECT completed FROM todos WHERE id = ?", id).Scan(&completed); err != nil {
			return nil, err
		}

		newVal := 1
		if completed == 1 {
			newVal = 0
		}
		_, err := DB.Exec("UPDATE todos SET completed = ? WHERE id = ?", newVal, id)
		return nil, err
	})

	routing.RegisterRemoteAction("deleteTodo", func(ctx context.Context, rc routing.RemoteContext, input any) (any, error) {
		var id int
		switch v := input.(type) {
		case float64:
			id = int(v)
		case int:
			id = v
		case string:
			fmt.Sscanf(v, "%d", &id)
		case json.Number:
			id64, _ := v.Int64()
			id = int(id64)
		default:
			return nil, fmt.Errorf("invalid id: expected number or string, got %T", input)
		}
		_, err := DB.Exec("DELETE FROM todos WHERE id = ?", id)
		return nil, err
	})

	routing.RegisterRemoteAction("getTodos", func(ctx context.Context, rc routing.RemoteContext, input any) (any, error) {
		return GetTodos(), nil
	})

	routing.RegisterRemoteAction("getTodo", func(ctx context.Context, rc routing.RemoteContext, input any) (any, error) {
		var id int
		switch v := input.(type) {
		case float64:
			id = int(v)
		case int:
			id = v
		case string:
			fmt.Sscanf(v, "%d", &id)
		case json.Number:
			id64, _ := v.Int64()
			id = int(id64)
		default:
			return nil, fmt.Errorf("invalid id: expected number or string, got %T", input)
		}
		var t Todo
		err := DB.QueryRow("SELECT id, text, completed FROM todos WHERE id = ?", id).Scan(&t.ID, &t.Text, &t.Completed)
		return t, err
	})
}
