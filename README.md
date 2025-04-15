# Library API

## How to Run the Project Locally

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Daniel-timmy/library-api.git
   cd library-api
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Database Setup**
   The project uses MongoDB as the database of choice.
   Create a new project in mongodb.com, setup the cluster and copy the
   connection string

4. **Set up environment variables:**
   Create a `.env.development.local` and `.env.production.local` file in the root directory and add the necessary environment variables. For example:

   ```env
   PORT=3000
   DATABASE_URL=your-database-url(connection)
   NODE_ENV = development or production

   JWT_SECRET ='your secret key'
   JWT_EXPIRES_IN ="1d"
   ```

5. **Run the application:**

   ```sh
   npm start
   npm run dev   (development)
   ```

6. **Access the API:**
   Open your browser and go to `http://localhost:3000`
   for swagger UI go to `http://localhost:3000/api-docs`

**Live Link**
```
https://library-api-v2q4.onrender.com/
```
