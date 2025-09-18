# I.F.C Backend - Node.js API Server

A comprehensive backend API server for the India Farmers Club platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication with role-based access
- 👥 User management (Farmers & Workers)
- 🏪 Product management system
- 📢 Announcements & government schemes
- 🔒 Security middleware and validation
- 📊 Data aggregation and statistics
- 🌐 RESTful API design
- 📱 CORS-enabled for frontend integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **multer** - File upload handling

## Project Structure

```
backend/
├── models/              # Database schemas
│   ├── User.js         # User model (Farmers & Workers)
│   ├── Product.js      # Product model
│   └── Announcement.js # Announcement model
├── routes/             # API routes
│   ├── auth.js        # Authentication routes
│   ├── products.js    # Product management
│   └── announcements.js # Announcements
├── middleware/         # Custom middleware
│   └── auth.js        # Authentication middleware
├── server.js          # Main server file
├── .env              # Environment variables
└── package.json      # Dependencies
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy and edit .env file
   cp .env.example .env
   ```

   **Required environment variables:**
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/ifc_database
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Production Setup

```bash
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update profile | Private |
| PUT | `/password` | Change password | Private |

### Product Routes (`/api/products`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all products | Public |
| GET | `/:id` | Get single product | Public |
| POST | `/` | Create product | Owner Only |
| PUT | `/:id` | Update product | Owner Only |
| DELETE | `/:id` | Delete product | Owner Only |
| GET | `/owner/my` | Get owner's products | Owner Only |
| POST | `/:id/ratings` | Rate product | Private |
| GET | `/categories/stats` | Category statistics | Public |

### Announcement Routes (`/api/announcements`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get announcements | Public |
| GET | `/:id` | Get single announcement | Public |
| POST | `/` | Create announcement | Private |
| PUT | `/:id` | Update announcement | Creator/Admin |
| DELETE | `/:id` | Delete announcement | Creator/Admin |
| POST | `/:id/like` | Like/unlike announcement | Private |
| POST | `/:id/comments` | Add comment | Private |
| GET | `/stats/overview` | Get statistics | Public |

## Database Models

### User Model

```javascript
{
  name: String,           // Full name
  email: String,          // Unique email
  password: String,       // Hashed password
  phone: String,          // Phone number
  role: String,           // 'owner' or 'worker'
  
  // Owner specific fields
  landSize: String,       // Land size in acres
  cropsGrown: String,     // Types of crops
  soilType: String,       // Soil type
  
  // Worker specific fields
  age: Number,            // Age (18-65)
  
  // Common fields
  isActive: Boolean,      // Account status
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model

```javascript
{
  name: String,           // Product name
  description: String,    // Product description
  price: Number,          // Price per unit
  category: String,       // Product category
  quantity: Number,       // Available quantity
  unit: String,          // Unit of measurement
  images: [String],      // Product images
  owner: ObjectId,       // Reference to User
  isAvailable: Boolean,  // Availability status
  ratings: [Object],     // User ratings
  averageRating: Number, // Calculated average
  views: Number,         // View count
  createdAt: Date,
  updatedAt: Date
}
```

### Announcement Model

```javascript
{
  title: String,          // Announcement title
  description: String,    // Detailed description
  category: String,       // Category type
  isGovernment: Boolean,  // Government scheme flag
  priority: String,       // Priority level
  targetAudience: [String], // Target users
  link: String,          // External link
  author: Object,        // Author information
  validFrom: Date,       // Valid from date
  validUntil: Date,      // Expiry date
  views: Number,         // View count
  likes: [Object],       // User likes
  comments: [Object],    // User comments
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication & Security

### JWT Authentication
- Token-based authentication
- 7-day token expiration
- Automatic token refresh
- Role-based access control

### Security Features
- Password hashing with bcryptjs
- Input validation with express-validator
- Rate limiting on sensitive endpoints
- CORS configuration
- Request sanitization
- Error handling middleware

### User Roles

**Owner (Farmer)**
- Can create, update, delete products
- Access to owner dashboard
- Can view and manage their listings
- Can rate other products

**Worker**
- Can view all products
- Can contact product owners
- Can rate products
- Access to worker dashboard

## Validation Rules

### User Registration
- Name: 2-50 characters
- Email: Valid email format
- Password: Minimum 6 characters
- Phone: Valid phone number format
- Age (workers): 18-65 years
- Required fields based on role

### Product Creation
- Name: 2-100 characters
- Price: Positive number
- Category: Predefined categories
- Quantity: Positive integer
- Description: Maximum 500 characters

### Announcements
- Title: 5-200 characters
- Description: 10-1000 characters
- Valid URL for external links
- Valid date formats

## Database Configuration

### MongoDB Connection
```javascript
// Using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### Indexes
- Text search indexes on products and announcements
- Compound indexes for efficient queries
- Unique indexes on email fields

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

### Error Response Format
```javascript
{
  message: "Error description",
  errors: [/* Validation errors array */]
}
```

## Environment Variables

Create a `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/ifc_database

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5000000
FILE_UPLOAD_PATH=./public/uploads

# API Keys (Optional)
GEMINI_API_KEY=your_gemini_api_key
WEATHER_API_KEY=your_weather_api_key
```

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Farmer",
    "email": "john@example.com",
    "password": "securepassword",
    "phone": "+1234567890",
    "role": "owner",
    "landSize": "10 acres",
    "cropsGrown": "Wheat, Rice",
    "soilType": "loam"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Organic Wheat",
    "description": "Premium organic wheat",
    "price": 25,
    "category": "grains",
    "quantity": 100,
    "unit": "kg"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products?category=grains&page=1&limit=10
```

## Development Scripts

```bash
# Start development server with auto-restart
npm run dev

# Start production server
npm start

# Run tests (if implemented)
npm test
```

## Production Deployment

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas for database
3. Configure secure JWT secret
4. Set up proper CORS origins
5. Enable rate limiting
6. Configure file upload limits

## Monitoring & Logging

### Health Check
- `GET /api/health` - Server health status
- Returns server version and timestamp
- Can be used for load balancer health checks

### Logging
- Console logging for development
- File logging for production
- Error tracking and monitoring

## Contributing

1. Follow the existing code structure
2. Add proper validation for new endpoints
3. Include error handling
4. Update documentation for new features
5. Test with different user roles

## License

This project is part of the I.F.C (India Farmers Club) platform.