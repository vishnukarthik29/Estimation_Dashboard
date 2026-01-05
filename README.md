# 🚀 Complete Integration Guide - Frontend + Backend

Follow these steps to integrate your Vue.js frontend with the Node.js backend.

## 📋 Prerequisites Checklist

- [ ] Node.js installed (v14 or higher)
- [ ] MongoDB installed and running
- [ ] npm or yarn installed
- [ ] Code editor (VS Code recommended)
- [ ] Basic knowledge of Vue.js and Node.js

---

## 🔧 Part 1: Backend Setup (15 minutes)

### Step 1: Create Backend Project

```bash
mkdir procurement-console-backend
cd procurement-console-backend
npm init -y
```

### Step 2: Install Backend Dependencies

```bash
npm install express mongoose cors dotenv
npm install --save-dev nodemon
```

### Step 3: Create Project Structure

```bash
mkdir models controllers routes seeders
touch server.js .env .gitignore
```

### Step 4: Create All Backend Files

Create the following files with the code from the artifacts:

1. **server.js** - Main server file
2. **models/Category.js** - Category model
3. **models/Subcategory.js** - Subcategory model
4. **models/Spec.js** - Spec model
5. **models/Calculation.js** - Calculation model
6. **controllers/categoryController.js** - Category logic
7. **controllers/subcategoryController.js** - Subcategory logic
8. **controllers/specController.js** - Spec logic
9. **controllers/calculationController.js** - Calculation logic
10. **routes/categoryRoutes.js** - Category routes
11. **routes/subcategoryRoutes.js** - Subcategory routes
12. **routes/specRoutes.js** - Spec routes
13. **routes/calculationRoutes.js** - Calculation routes
14. **seeders/seed.js** - Database seeder

### Step 5: Configure Environment Variables

Create `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/procurement_console
```

### Step 6: Update package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seeders/seed.js"
  }
}
```

### Step 7: Start MongoDB

```bash
# In a new terminal
mongod
```

### Step 8: Seed Database

```bash
npm run seed
```

Expected output:

```
✓ MongoDB connected
✓ Existing data cleared
✓ Categories created
✓ Subcategories created
✓ Specifications created
✓ Database seeded successfully!
```

### Step 9: Start Backend Server

```bash
npm run dev
```

Expected output:

```
✓ MongoDB connected successfully
✓ Server running on port 5000
✓ Environment: development
```

### Step 10: Test Backend

Open browser and visit: `http://localhost:5000/api/health`

Should see:

```json
{
  "status": "OK",
  "timestamp": "2025-01-05T...",
  "mongodb": "connected"
}
```

✅ **Backend is ready!**

---

## 🎨 Part 2: Frontend Setup (10 minutes)

### Step 1: Create Vue Project (if not already created)

```bash
# In a new terminal, go back to parent directory
cd ..
vue create procurement-console-frontend
# Select Vue 3 and default configuration
```

Or if using existing project:

```bash
cd your-existing-vue-project
```

### Step 2: Install Axios

```bash
npm install axios
```

### Step 3: Create Project Structure

```bash
mkdir -p src/services
touch src/services/api.js
touch .env
touch vue.config.js
```

### Step 4: Create Environment File

Create `.env` in frontend root:

```env
VUE_APP_API_URL=http://localhost:5000/api
```

### Step 5: Create API Service

Create `src/services/api.js` with the API service code from artifacts.

### Step 6: Create or Update Component

Option A - New Component:

```bash
mkdir -p src/components
# Create src/components/ProcurementConsole.vue with the code from artifacts
```

Option B - Update Existing:
Replace your existing component with the integrated version from artifacts.

### Step 7: Update App.vue (if needed)

```vue
<template>
  <div id="app">
    <ProcurementConsole />
  </div>
</template>

<script>
import ProcurementConsole from './components/ProcurementConsole.vue'

export default {
  name: 'App',
  components: {
    ProcurementConsole,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
```

### Step 8: Configure Proxy (Optional but Recommended)

Create `vue.config.js` with the proxy configuration from artifacts.

If using proxy, update `.env`:

```env
VUE_APP_API_URL=/api
```

### Step 9: Start Frontend Server

```bash
npm run serve
```

Expected output:

```
  App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.x.x:8080/
```

### Step 10: Open Application

Visit: `http://localhost:8080`

✅ **Frontend is ready!**

---

## 🧪 Part 3: Testing Integration (5 minutes)

### Test 1: Check Console for Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Should see no errors
4. Should see API requests in Network tab

### Test 2: Verify Data Loading

1. Check if categories dropdown is populated
2. Categories should show: Construction, Electrical, Plumbing

### Test 3: Add New Category

1. Click "+" button next to Category dropdown
2. Enter "HVAC"
3. Click "Add"
4. Should see success message
5. New category should appear in dropdown

### Test 4: Add New Subcategory

1. Select "Construction" category
2. Click "+" next to Subcategory
3. Enter "Roofing"
4. Click "Add"
5. Should appear in subcategory dropdown

### Test 5: Save Calculation

1. Select Category: Construction
2. Select Subcategory: Foundation
3. Select Spec: Grade M20
4. Switch to "Calculate from Line Items"
5. Click "+ Add Material"
6. Fill in: Name: Cement, Qty: 50, UOM: Bag, Rate: 350
7. Enter Labour: 5000
8. Enter Transport: 2000
9. Enter PMC Safety: 10
10. Click "Save Calculation"
11. Should see success message

### Test 6: Verify in Database

```bash
# In terminal
mongosh procurement_console
db.calculations.find().pretty()
```

Should see your saved calculation.

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Check:**

- Is MongoDB running? → Start with `mongod`
- Port 5000 already in use? → Change PORT in `.env`
- Dependencies installed? → Run `npm install`

**Solution:**

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Check port availability
lsof -i :5000
```

### Issue: Frontend shows network error

**Check:**

- Is backend running? → Start with `npm run dev`
- Correct API URL? → Check `.env` file
- CORS enabled? → Check backend server.js

**Solution:**

```bash
# Test backend health
curl http://localhost:5000/api/health

# Check backend logs
# Should see API requests being logged
```

### Issue: CORS error in browser

**Solution 1 (Recommended):**
Use proxy configuration in `vue.config.js`

**Solution 2:**
Enable CORS in backend:

```javascript
// server.js
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
  }),
)
```

### Issue: Data not appearing in dropdowns

**Check:**

1. Browser console for errors
2. Network tab for failed requests
3. Backend logs for database errors

**Solution:**

```bash
# Re-seed database
cd backend
npm run seed

# Restart backend
npm run dev

# Refresh frontend
```

### Issue: "Cannot read property '\_id'"

**Cause:** Component expects MongoDB `_id` field

**Solution:** Already handled in the integrated component - uses `_id` for all data

---

## 📊 Verification Checklist

Backend:

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Health check returns OK
- [ ] Database is seeded with sample data
- [ ] No errors in terminal

Frontend:

- [ ] Frontend server is running on port 8080
- [ ] No errors in browser console
- [ ] Categories are loading
- [ ] Can add new entries
- [ ] Can save calculations
- [ ] Success/error messages appear

Integration:

- [ ] API calls visible in Network tab
- [ ] Data flows from backend to frontend
- [ ] CRUD operations work
- [ ] Real-time updates happen
- [ ] Loading states work

---

## 🎯 Quick Commands Reference

### Backend Commands

```bash
# Start backend
cd backend && npm run dev

# Seed database
npm run seed

# Check MongoDB
mongosh procurement_console
```

### Frontend Commands

```bash
# Start frontend
cd frontend && npm run serve

# Build for production
npm run build

# Lint code
npm run lint
```

### Database Commands

```bash
# Start MongoDB
mongod

# Open MongoDB shell
mongosh

# Check database
use procurement_console
db.categories.find()
db.calculations.find()
```

---

## 🚀 Next Steps

Now that integration is complete, you can:

1. **Add Authentication**
   - Implement user login/signup
   - Add JWT tokens
   - Protect routes

2. **Add More Features**
   - Export to Excel/PDF
   - Search and filter
   - Pagination
   - Sort options

3. **Improve UI/UX**
   - Add more animations
   - Improve error messages
   - Add confirmation dialogs
   - Better loading states

4. **Deploy to Production**
   - Deploy backend to Heroku/Railway
   - Deploy frontend to Vercel/Netlify
   - Use MongoDB Atlas for database
   - Configure production environment variables

---

## 📚 Additional Resources

- [Vue.js Documentation](https://vuejs.org/)
- [Axios Documentation](https://axios-http.com/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

---

## ✅ Success!

Congratulations! Your frontend and backend are now fully integrated. You have a complete full-stack application with:

- ✅ Vue.js frontend with Tailwind CSS
- ✅ Node.js/Express backend
- ✅ MongoDB database
- ✅ RESTful API
- ✅ Axios integration
- ✅ Real-time data updates
- ✅ Error handling
- ✅ Loading states
- ✅ CRUD operations

**Happy Coding! 🎉**
