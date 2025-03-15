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

3. **Set up environment variables:**
   Create a `.env.development.local` and `.env.production.local` file in the root directory and add the necessary environment variables. For example:

   ```env
   PORT=3000
   DATABASE_URL=your-database-url
   NODE_ENV = development or production

   JWT_SECRET ='your secret key'
   JWT_EXPIRES_IN ="1d"
   ```

4. **Run the application:**

   ```sh
   npm start
   npm run dev   (development)
   ```

5. **Access the API:**
   Open your browser and go to `http://localhost:3000`
   for swagger UI go to `http://localhost:3000/api-docs`
