package main

import (
	"log"

	"github.com/aydenstechdungeon/gospa"
	gospafiber "github.com/aydenstechdungeon/gospa/fiber"

	"gospa-app/routes"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	routes.InitDB()

	app := gospa.New(gospa.Config{
		DevMode:    true,
		PreloadCSS: []string{"/static/css/main.css"},
	})
	cspPolicy := "default-src 'self'; script-src 'self' 'nonce-{nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss: https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
	app.Fiber.Use(gospafiber.SecurityHeadersMiddleware(cspPolicy))
	log.Fatal(app.Run(":3000"))
}
