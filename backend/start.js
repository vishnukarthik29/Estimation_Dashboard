// server.js - Main Entry Point (ESM)

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import routes
import categoryRoutes from './routes/categoryRoutes.js'
import subcategoryRoutes from './routes/subcategoryRoutes.js'
import specRoutes from './routes/specRoutes.js'
import calculationRoutes from './routes/calculationRoutes.js'

// Initialize Express app
const app = express()

// Middleware
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/procurement_console'

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully')
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err)
    process.exit(1)
  })

// API Routes
app.use('/api/categories', categoryRoutes)
app.use('/api/subcategories', subcategoryRoutes)
app.use('/api/specs', specRoutes)
app.use('/api/calculations', calculationRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server gracefully...')
  await mongoose.connection.close()
  console.log('MongoDB connection closed')
  process.exit(0)
})
