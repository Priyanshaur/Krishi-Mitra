# Krishi Mitra Diagnosis Feature Troubleshooting Guide

## Issue: "Failed to get diagnosis" Error

This guide will help you troubleshoot and resolve the "Failed to get diagnosis" error when using the crop disease diagnosis feature.

## 1. Verify All Services Are Running

First, ensure all required services are running on their correct ports:

### Check Service Status
```bash
# Check ML Service (port 8000)
netstat -ano | findstr :8000

# Check Backend (port 5000)
netstat -ano | findstr :5000

# Check Frontend (port 3001)
netstat -ano | findstr :3001
```

### Expected Services
- **ML Service**: http://localhost:8000
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3001

### Restart Services if Needed
If any service is not running:

1. **ML Service**:
   ```bash
   cd C:\Users\priya\Desktop\krishi-mitra\ml
   python app.py
   ```

2. **Backend**:
   ```bash
   cd C:\Users\priya\Desktop\krishi-mitra\backend
   npm run dev
   ```

3. **Frontend**:
   ```bash
   cd C:\Users\priya\Desktop\krishi-mitra\frontend
   npm run dev
   ```

## 2. Verify Service Health

### Test ML Service
```bash
curl http://localhost:8000/health
```
Expected response: `{"status":"ok",...}`

### Test Backend
```bash
curl http://localhost:5000/api/health
```
Expected response: `{"status":"OK",...}`

## 3. Browser Debugging

### Open Developer Tools
1. Press `F12` or `Ctrl+Shift+I` to open Developer Tools
2. Go to the **Console** tab
3. Go to the **Network** tab

### Check Console for Errors
Look for any JavaScript errors or warnings that might indicate what's going wrong.

### Check Network Requests
1. In the Network tab, click the "Clear" button (trash icon)
2. Try uploading an image in the diagnosis feature
3. Look for requests to:
   - `http://localhost:5000/api/diagnose` (POST request)
   - Check the status code and response

## 4. Authentication Verification

The diagnosis feature requires authentication. Make sure you're logged in:

1. Check if you have a valid token in localStorage:
   ```javascript
   // In browser console
   localStorage.getItem('token')
   ```
   This should return a long string (JWT token).

2. If no token exists, log in again.

## 5. Common Issues and Solutions

### Issue 1: CORS Errors
**Symptoms**: Console shows CORS-related errors
**Solution**: 
- Ensure backend is running with correct CORS configuration
- Check that `CLIENT_URL` in backend `.env` matches frontend URL

### Issue 2: Authentication Token Missing
**Symptoms**: 401 Unauthorized errors
**Solution**:
- Make sure you're logged in
- Check that the token is being sent in the Authorization header

### Issue 3: File Upload Issues
**Symptoms**: "Please upload an image" error
**Solution**:
- Ensure you've selected a valid image file
- Check that the file is not too large (>10MB)
- Verify the file is a valid image format (JPG, PNG)

### Issue 4: ML Service Not Responding
**Symptoms**: Long loading times, timeout errors
**Solution**:
- Check if ML service is running on port 8000
- Verify the model is loaded correctly (check ML service console)

## 6. Manual Testing

### Test Diagnosis Endpoint Directly
You can test the diagnosis endpoint using curl or Postman:

```bash
# First, get an auth token by logging in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use the token to test diagnosis endpoint
curl -X POST http://localhost:5000/api/diagnose \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "cropType=tomato" \
  -F "notes=Test diagnosis"
```

## 7. Check Recent Changes

If the feature was working before, check what might have changed:

1. Recent code modifications
2. Environment variable changes
3. Dependency updates
4. Configuration file modifications

## 8. Reset and Retry

If all else fails:

1. Clear browser cache and localStorage
2. Restart all services in order:
   - ML Service first
   - Backend second
   - Frontend last
3. Try the diagnosis feature again

## 9. Contact Support

If you continue to experience issues:

1. Take screenshots of:
   - Console errors
   - Network request failures
   - The exact error message
2. Include steps to reproduce the issue
3. Provide information about your environment (OS, browser, etc.)

## Need Help?

If you're still experiencing issues after following this guide, please provide:

1. Screenshots of browser console errors
2. Details of network requests that failed
3. Steps you've already tried
4. Any recent changes to the code or environment