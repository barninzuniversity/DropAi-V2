// Using ES module syntax
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DEFAULT_PORT = process.env.PORT || 3000;

// Serve static files from the dist directory (Vite's build output)
app.use(express.static(path.join(__dirname, 'dist')));

// For any other routes, send the index.html file
// This is important for SPA routing to work correctly
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Function to start server that handles port conflicts
const startServer = (port) => {
  try {
    app.listen(port, () => {
      console.log(`✨ Server is running at http://localhost:${port}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
console.log('🚀 Starting server...');
startServer(DEFAULT_PORT);
