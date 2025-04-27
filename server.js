// Using ES module syntax
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// Try a range of ports if the preferred one is busy
const PORT = process.env.PORT || 4000;
const FALLBACK_PORTS = [4001, 4002, 4003, 5000, 5001];

// Enable gzip compression
app.use(compression());

// Serve static files from the dist directory with proper caching
app.use(express.static(join(__dirname, 'dist'), {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // No cache for HTML files
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.endsWith('.js') || path.endsWith('.css')) {
      // Cache JS and CSS files for 1 hour
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// Serve the manifest file with the correct MIME type
app.get('/manifest.webmanifest', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile(join(__dirname, 'dist', 'manifest.webmanifest'));
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'), err => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading the application');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something broke!');
});

// Try to start the server on the preferred port, fall back to alternatives if busy
function startServer(portIndex = 0) {
  const currentPort = portIndex === 0 ? PORT : FALLBACK_PORTS[portIndex - 1];
  
  const server = app.listen(currentPort, () => {
    console.log('\n======================================');
    console.log(`✅ Server running successfully on port ${currentPort}`);
    console.log(`📱 App available at http://localhost:${currentPort}`);
    console.log(`📂 Static files being served from: ${join(__dirname, 'dist')}`);
    console.log('======================================\n');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${currentPort} is busy, trying next port...`);
      if (portIndex < FALLBACK_PORTS.length) {
        startServer(portIndex + 1);
      } else {
        console.error('❌ All ports are busy. Please close some applications and try again.');
        process.exit(1);
      }
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
}

// Start the server
console.log('\n🚀 Starting server...');
console.log('📋 Will try these ports in order:', [PORT, ...FALLBACK_PORTS].join(', '));
startServer();
