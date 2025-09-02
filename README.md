This is the backend for a Food Delivery Application, built with Express.js.
It provides RESTful APIs for managing food items, carts, and orders.

🚀 Features

Food API: Browse and manage food items

Cart API: Add/remove items from the cart

Orders API: Place and manage orders

Authentication: JWT-based user login & signup

MongoDB used for data storage

🛠️ Tech Stack

Node.js + Express.js

Database: MongoDB

Authentication: JWT

Other Tools: dotenv, nodemon, etc.

backend/
│-- src/
│   │-- routes/        # All route files (food, cart, orders, auth)
│   │-- controllers/   # Business logic for APIs
│   │-- models/        # Database models/schemas
│   │-- middlewares/   # Authentication & error handling
│   │-- config/        # Database & environment config
│   │-- app.js         # Express app setup
│   └-- server.js      # Entry point
│
│-- package.json
│-- .env.example
│-- README.md
