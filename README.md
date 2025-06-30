# Financial Dashboard

A full-stack financial dashboard application with user authentication, transaction management, analytics, and AI-powered features.

## Project Structure

```
financial-dashboard/
├── Backend/        # Node.js + Express backend API
├── Frontend/       # React frontend
```

## Backend
- **Tech:** Node.js, Express, MongoDB, JWT
- **Features:**
  - User registration & login
  - Transaction CRUD
  - Reviews
  - AI endpoints

### Running Backend Locally
1. `cd Backend`
2. Install dependencies: `npm install`
3. Set up `.env` with your MongoDB URI and JWT secret
4. Start server: `npm start`

### API Endpoints
- `/api/auth/login` – User login
- `/api/auth/register` – User registration
- `/api/reviews` – Reviews CRUD
- `/api/transactions` – Transactions CRUD

## Frontend
- **Tech:** React, TypeScript, MUI, Axios
- **Features:**
  - Dashboard UI
  - Analytics & charts
  - User authentication
  - File upload & export

### Running Frontend Locally
1. `cd Frontend`
2. Install dependencies: `npm install`
3. Create `.env` with:
   ```
   REACT_APP_API_URL=https://looprai.onrender.com/api
   REACT_APP_GROQ_API_KEY=your_groq_api_key
   ```
4. Start app: `npm start`

### Building for Production
- `npm run build` (output in `build/`)

### Deploying to Render.com
- Connect your repo to Render.com
- Set build command: `npm run build`
- Set publish directory: `build`
- Add environment variables as above

## License
MIT
