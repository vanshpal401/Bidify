# Online Auction Management System

## Project Overview
The **Online Auction Management System** is a robust platform built using the MERN stack that enables users to create and participate in auctions seamlessly. It supports real-time notifications, secure user authentication, and efficient management of bids, payments, and commissions. The system is designed to cater to different user roles and ensure smooth auction transactions.

---

## Features

### 1. **Auction Management**
- Users can create auctions for items.
- Real-time updates on bids.

### 2. **Bidding System**
- Registered users can place bids on available auctions.
- Displays current highest bid dynamically.

### 3. **Payment Management**
- Secure payment processing for completed auctions.
- Automatic calculation and management of commissions.

### 4. **User Authentication**
- OTP-based authentication using **Node Mailer**.
- Role-based access for administrators and users.

### 5. **Real-Time Notifications**
- Instant notifications for bidding updates and auction closures.

### 6. **Role Management**
- Supports different user roles:
  - **Admin**: Manage auctions, users, and platform settings.
  - **User**: Create auctions, bid on items, and make payments.

---

## Technology Stack

### Frontend
- **React.js**: Interactive UI components and dynamic data rendering.
- **Vite**: Fast development environment for React applications.

### Backend
- **Node.js**: Server-side logic and API endpoints.
- **Express.js**: RESTful API development.

### Database
- **MongoDB**: NoSQL database for storing auction data, user profiles, and bids.

### Additional Tools
- **Node Mailer**: Real-time email notifications for user authentication and updates.

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v14+)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ShivamGupta1802/Bidify.git
   cd project
   ```

2. **Set Up Backend**:
   ```bash
   cd backend
   npm install
   ```

   - Create a `.env` file in the `backend` directory with the following variables:
     ```env
     PORT=<YOUR_PORT>
     CLOUDINARY_CLOUD_NAME=<YOUR_CLOUD_NAME>
     CLOUDINARY_API_KEY=<YOUR_API_KEY>
     CLOUDINARY_API_SECRET=<YOUR_API_SECRET>

     FRONTEND_URL=<YOUR_FRONTEND_URL>

     MONGO_URI=<YOUR_MONGO_URI>

     JWT_SECRET_KEY=<YOUR_SECRET_KEY>
     JWT_EXPIRE=<EXPIRATION_DURATION>

     COOKIE_EXPIRE=<COOKIE_EXPIRATION_DURATION>

     SMTP_MAIL=<YOUR_EMAIL>
     SMTP_PASSWORD=<YOUR_PASSWORD>
     SMTP_SERVICE=<YOUR_SERVICE>
     SMTP_PORT=<YOUR_PORT>
     SMTP_HOST=<YOUR_HOST>
     ```

   - Start the backend server:
     ```bash
     npm start
     ```

3. **Set Up Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Access the Application**:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## Usage Instructions

1. **Register/Login**:
   - New users must register using their email to receive an OTP for verification.

2. **Create Auctions**:
   - Logged-in users can list items for auction with a start and end time.

3. **Place Bids**:
   - Browse active auctions and place bids dynamically.

4. **Payment Processing**:
   - Complete payments for won auctions, with commissions automatically deducted.

---

## Future Enhancements

- Deploy the application using **Heroku**, **Vercel**, or **AWS**.
- Add a dashboard for detailed analytics and reporting.
- Introduce a chat system for buyer-seller communication.
- Implement multi-currency payment support.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contact
For queries, please contact **Vansh Pal** at: [palv24190@gmail.com](mailto:sg3993415@gmail.com).
