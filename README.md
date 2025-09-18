# I.F.C (India Farmers Club) - Agriculture Portal

A comprehensive farmers and agriculture portal built with React, Node.js, and MongoDB. This full-stack application connects farmers with workers, provides product management, government announcements, and AI-powered assistance.

## 🌾 Project Overview

The I.F.C platform serves as a digital bridge between traditional farming and modern technology, empowering farmers with tools and knowledge for sustainable agriculture while building a supportive community.

## ✨ Features

### Core Features
- 🔐 **Role-based Authentication**: Separate registration for Farmers (Owners) and Agricultural Workers
- 🏪 **Product Management**: Farmers can list, edit, and manage their agricultural products
- 📢 **Government Announcements**: Dynamic feed of schemes, subsidies, and agricultural programs
- 🤖 **AI Chatbot**: Agricultural assistant for farming queries and recommendations
- 📊 **Dashboards**: Customized interfaces for owners and workers

### User Experience
- 🎨 **Agriculture-themed Design**: Green and earthy color palette with nature-inspired UI
- 📱 **Responsive Design**: Mobile-first approach for all devices
- ⚡ **Smooth Animations**: Framer Motion animations and hover effects
- 🧭 **Smooth Navigation**: One-page scrolling with section navigation

### Technical Features
- 🔒 **JWT Authentication**: Secure token-based authentication
- 🛡️ **Input Validation**: Comprehensive validation and sanitization
- 📈 **Real-time Updates**: Dynamic content and statistics
- 🌐 **RESTful API**: Well-structured backend architecture

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for validation
- **multer** for file uploads

## 📁 Project Structure

```
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js API server
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
└── README.md             # Project documentation
```

## 🚀 Quick Setup

### Prerequisites
- **Node.js** 16+ and npm
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ifc-farmers-portal
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## 🔧 Configuration

### Backend Environment Variables
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ifc_database
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=I.F.C - India Farmers Club
```

## 👥 User Roles & Features

### Farmer (Owner) Features
- ✅ Register with land size, crops grown, and soil type
- ✅ Create and manage product listings
- ✅ View sales statistics and dashboard
- ✅ Edit profile and farming details
- ✅ Access to owner-specific announcements

### Agricultural Worker Features
- ✅ Register with age and contact information
- ✅ Browse available products with search and filters
- ✅ View assigned tasks and progress
- ✅ Contact product owners directly
- ✅ Access to worker-specific job announcements

## 🎨 Design System

### Color Palette
- **Primary Green**: `#22c55e` - Represents growth and agriculture
- **Earth Tones**: `#eab308` - Represents soil and farming
- **Background**: Gradient from green to earth tones
- **Text**: Professional gray scales for readability

### Typography
- **Font Family**: Inter (modern, clean, and readable)
- **Responsive Sizes**: Mobile-first approach with fluid typography

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover effects
- **Forms**: Comprehensive validation with user-friendly messages
- **Navigation**: Smooth scroll and responsive design

## 📱 Pages & Components

### Main Pages
1. **Home**: Hero section with statistics and call-to-action
2. **About**: Platform mission, features, and company information
3. **Announcements**: Government schemes and agricultural updates
4. **Chatbot**: AI-powered agricultural assistant
5. **Authentication**: Login/register with role selection
6. **Dashboards**: Role-specific user interfaces

### Key Components
- **Navbar**: Responsive navigation with authentication state
- **Product Cards**: Detailed product information with ratings
- **Announcement Cards**: Government schemes with filtering
- **Chat Interface**: Interactive chatbot with quick suggestions
- **Profile Management**: User information and settings

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get products with filtering
- `POST /api/products` - Create new product (Owner only)
- `PUT /api/products/:id` - Update product (Owner only)
- `DELETE /api/products/:id` - Delete product (Owner only)

### Announcement Endpoints
- `GET /api/announcements` - Get announcements with filtering
- `POST /api/announcements/:id/like` - Like/unlike announcement
- `POST /api/announcements/:id/comments` - Add comment

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against abuse and spam
- **CORS Configuration**: Secure cross-origin resource sharing
- **Role-based Access**: Different permissions for owners and workers

## 📊 Database Schema

### Users Collection
- User authentication and profile information
- Role-specific fields (land size for owners, age for workers)
- Account status and timestamps

### Products Collection
- Product listings with pricing and availability
- Owner references and product categories
- Ratings and reviews system

### Announcements Collection
- Government schemes and announcements
- Priority levels and target audiences
- Engagement metrics (likes, comments, views)

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Configure environment variables

### Backend Deployment (Heroku/Railway)
1. Set up environment variables
2. Configure MongoDB Atlas connection
3. Deploy with `git push heroku main`

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🧪 Testing

### Frontend Testing
- Component testing with React Testing Library
- End-to-end testing with Cypress
- Visual regression testing

### Backend Testing
- Unit tests for API endpoints
- Integration tests for database operations
- Authentication and authorization testing

## 📈 Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format and responsive images
- **Caching**: Browser caching and API response caching
- **Bundle Analysis**: Webpack bundle optimization
- **Database Indexing**: Optimized queries and aggregations

## 🔮 Future Enhancements

### Planned Features
- 🌤️ **Weather Integration**: Real-time weather data and forecasts
- 📍 **Location Services**: GPS-based product recommendations
- 💬 **Real-time Chat**: Direct messaging between users
- 📧 **Email Notifications**: Updates and alerts
- 🏪 **Marketplace**: Enhanced buying/selling features
- 📱 **Mobile App**: React Native implementation

### Technical Improvements
- GraphQL API implementation
- Redis caching layer
- Advanced analytics and reporting
- Offline functionality
- Progressive Web App (PWA) features

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Follow coding standards**: Use TypeScript and proper error handling
4. **Test your changes**: Ensure all tests pass
5. **Submit a pull request**: Include description and screenshots

### Development Guidelines
- Use TypeScript for type safety
- Follow React best practices with hooks
- Implement proper error handling
- Add responsive design considerations
- Update documentation for new features

## 📝 License

This project is developed for the Smart India Hackathon (SIH) and is part of the I.F.C (India Farmers Club) initiative to empower farmers through technology.

## 🆘 Support

For questions and support:
- Check the documentation in `/frontend/README.md` and `/backend/README.md`
- Review API documentation for endpoint details
- Examine the codebase for implementation examples

---

**I.F.C - Empowering Farmers, Connecting Communities, Revolutionizing Agriculture** 🌾