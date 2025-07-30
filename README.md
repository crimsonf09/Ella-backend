# Ella-backend

Ella-backend is the server-side application for the **Ella** platform. It handles core logic, database operations, and provides APIs used by the front-end.

## How to Run

1. Clone the repository  
   ```bash
   git clone https://github.com/<your-username>/Ella-backend.git
   cd Ella-backend
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Create a `.env` file in the root and add:  
   ```
    GROQ_API_KEY=
    MONGODB_URI=
    JWT_SECRET=
    ACCESS_TOKEN_SECRET=
    REFRESH_TOKEN_SECRET=
    CLASSIFICATION_URI=
   ```

4. Start the server  
   ```bash
   npm run dev   # For development
   npm start     # For production
   ```

The server will run at **http://localhost:3000/** by default.
