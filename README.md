# ProShop - E-commerce Backend

This repository contains the backend server for ProShop, a full-featured e-commerce platform. It provides a RESTful API for managing products, users, and orders, built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
- **Product Management**: Full CRUD functionality for products, including ratings and reviews.
- **Order Processing**: Create orders, view user-specific orders, and manage order payment and delivery status.
- **Admin Funtionality**: Special routes for administrators to manage users, products, and all orders.
- **Image Uploads**: Handles image uploads for products using Multer and Cloudinary.
- **Data Seeding**: A script to easily populate the database with initial sample data.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: `jsonwebtoken`, `bcryptjs`
- **Image Handling**: `multer`, `cloudinary`
- **Environment**: `dotenv` for environment variable management
- **Deployment**: Configured for Vercel and includes a `Dockerfile` for containerization.

## Environment Variables

To run this project, you will need to add the following environment variables to a `.env` file in the `bacend` directory:

```
NODE_ENV=development
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
CLOUDINARY_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
CHAT_BOAT_URI=<your_chat_bot_api_url>
```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jassisamuran/proshop.git
    ```

2.  **Navigate to the backend directory:**
    ```bash
    cd proshop/bacend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Create `.env` file:**
    Create a `.env` file in the `bacend` directory and add the environment variables as specified above.

5.  **Seed the database (Optional):**
    To populate the database with sample users and products, run:
    ```bash
    node seeder.js
    ```
    To destroy all data in the database, run:
    ```bash
    node seeder.js -d
    ```

6.  **Start the server:**
    The server will start on the port specified in your `.env` file (defaults to 5000).
    ```bash
    npm start
    ```

## API Endpoints

The API is structured around users, products, and orders. All routes are prefixed with `/api`.

### User Routes (`/api/users`)

| Method | Endpoint         | Access  | Description                                 |
| :----- | :--------------- | :------ | :------------------------------------------ |
| `POST` | `/login`         | Public  | Authenticate a user and get a token.        |
| `POST` | `/`              | Public  | Register a new user.                        |
| `GET`  | `/`              | Admin   | Get all users.                              |
| `GET`  | `/profile`       | Private | Get the logged-in user's profile.           |
| `PUT`  | `/profile`       | Private | Update the logged-in user's profile.        |
| `GET`  | `/:id`           | Admin   | Get a specific user by their ID.            |
| `PUT`  | `/:id`           | Admin   | Update a specific user's details.           |
| `DELETE`| `/:id`          | Admin   | Delete a user.                              |

### Product Routes (`/api/products`)

| Method | Endpoint             | Access  | Description                               |
| :----- | :------------------- | :------ | :---------------------------------------- |
| `GET`  | `/`                  | Public  | Fetch all products.                       |
| `POST` | `/`                  | Admin   | Create a new product.                     |
| `POST` | `/getProductByIds`   | Public  | Fetch multiple products by their IDs.     |
| `GET`  | `/:id/top`           | Public  | Fetch the top-rated products.             |
| `GET`  | `/:id`               | Public  | Fetch a single product by its ID.         |
| `PUT`  | `/:id`               | Admin   | Update a product.                         |
| `DELETE`| `/:id`              | Admin   | Delete a product.                         |
| `POST` | `/:id/reviews`       | Private | Create a new review for a product.        |

### Order Routes (`/api/orders`)

| Method | Endpoint            | Access  | Description                                 |
| :----- | :------------------ | :------ | :------------------------------------------ |
| `POST` | `/`                 | Private | Create a new order.                         |
| `GET`  | `/`                 | Admin   | Get all orders.                             |
| `GET`  | `/myorders`         | Private | Get all orders for the logged-in user.      |
| `GET`  | `/getOrderSummary`  | Private | Get a summary of the user's orders.         |
| `GET`  | `/list`             | Private | List and filter orders for the user.        |
| `GET`  | `/:id`              | Private | Get a specific order by its ID.             |
| `GET`  | `/:id/status`       | Private | Get the delivery and payment status of an order. |
| `PUT`  | `/:id/pay`          | Private | Mark an order as paid.                      |
| `PUT`  | `/:id/deliver`      | Admin   | Mark an order as delivered.                 |

### Upload Route (`/api/upload`) 

| Method | Endpoint   | Access  | Description                      |
| :----- | :--------- | :------ | :------------------------------- |
| `POST` | `/`        | Private | Upload an image to Cloudinary.   |
