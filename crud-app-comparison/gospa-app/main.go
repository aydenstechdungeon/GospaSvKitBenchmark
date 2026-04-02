package main

import (
	"log"

	"github.com/aydenstechdungeon/gospa"
	_ "github.com/mattn/go-sqlite3"

	"gospa-app/routes"
)

func main() {
	routes.InitDB()

	app := gospa.New(gospa.Config{
		DevMode:    true,
		PreloadCSS: []string{"/static/css/main.css"},
	})

	log.Fatal(app.Run(":3000"))
}
