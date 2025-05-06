const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Function to generate QR code
async function generateQRCode(url, outputPath) {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Generate QR code
    await qrcode.toFile(outputPath, url, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return { success: true, path: outputPath };
  } catch (error) {
    console.error('Error generating QR code:', error);
    return { success: false, error: error.message };
  }
}

// API endpoint to generate QR code
app.post('/generate', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  const timestamp = Date.now();
  const outputPath = path.join(__dirname, 'public', 'qrcodes', `qrcode-${timestamp}.png`);
  
  const result = await generateQRCode(url, outputPath);
  
  if (result.success) {
    res.json({
      success: true,
      message: 'QR code generated successfully',
      qrCodeUrl: `/qrcodes/qrcode-${timestamp}.png`
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: result.error
    });
  }
});

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Start web server if no arguments provided
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log('Send a POST request to /generate with a JSON body containing a "url" property');
    });
  } else {
    // Generate QR code from command line arguments
    const url = args[0];
    const outputPath = args[1] || path.join(__dirname, `qrcode-${Date.now()}.png`);
    
    generateQRCode(url, outputPath).then(result => {
      if (result.success) {
        console.log(`QR code generated successfully at: ${outputPath}`);
      } else {
        console.error(`Failed to generate QR code: ${result.error}`);
      }
    });
  }
}

// Export functions for use in other modules
module.exports = {
  generateQRCode
};

