# Barninz Shop - React E-commerce Website

## Deployment Guide for Render.com

This guide will help you deploy this React application on Render.com.

### Prerequisites

- A [Render.com](https://render.com) account
- Your project pushed to a GitHub, GitLab, or Bitbucket repository

### Deployment Steps

1. **Log in to Render.com**
   - Go to [dashboard.render.com](https://dashboard.render.com) and sign in

2. **Create a New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub/GitLab account if you haven't already
   - Select your repository

3. **Configure the Web Service**
   - **Name**: Choose a name for your service (e.g., barninz-shop)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Branch**: main (or your preferred branch)
   - **Region**: Choose the region closest to your users

4. **Add Environment Variables**
   - In the "Environment" tab, add the following variables:
     - `VITE_EMAILJS_SERVICE_ID`: Your EmailJS service ID
     - `VITE_EMAILJS_ORDER_TEMPLATE_ID`: Your order template ID
     - `VITE_EMAILJS_CONTACT_TEMPLATE_ID`: Your contact template ID
     - `VITE_EMAILJS_SHARE_TEMPLATE_ID`: Your share template ID
     - `VITE_EMAILJS_USER_ID`: Your EmailJS user ID

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

6. **Access Your Deployed Application**
   - Once deployment is complete, you can access your application at the URL provided by Render (e.g., https://your-app-name.onrender.com)

### Troubleshooting

- If you encounter any issues with the deployment, check the logs in the Render dashboard
- Make sure all environment variables are correctly set
- If emails aren't being sent, verify your EmailJS configuration

### Contact

If you have any questions or need assistance, please contact us at barninzshop@gmail.com