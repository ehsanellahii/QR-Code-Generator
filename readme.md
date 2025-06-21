# QR Code Generator Service

A simple Node.js service to generate QR codes via an HTTP API or from the command line, using the `qrcode` library and Express.

## Features

- Generate QR codes with high error-correction (Level H)
- Customize margin, size, and colors
- Expose an HTTP endpoint (`POST /generate`)
- Command-line interface for quick QR code generation
- Automatically creates output directories if needed

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm (comes with Node.js)

## Installation

1. Clone the repository or copy the files into your project directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Ensure you have a public folder in the project root, or let the service create subfolders under public/qrcodes.

## Usage

1. Run as a Web Server
   Start the Express server on port 3000 (default):

   ```bash
   node index.js
   ```

You should see:
Server running at <http://localhost:3000>
Send a POST request to /generate with a JSON body containing a "url" property
Generate QR Code via HTTP
Endpoint: POST /generate

Headers: Content-Type: application/json

Body:

```bash
{
"url": "https://example.com"
}
```

Success Response (200):

```bash
{
"success": true,
"message": "QR code generated successfully",
"qrCodeUrl": "/qrcodes/qrcode-1618888888888.png"
}
```

Error Responses:

400: Missing url property

500: Failed to generate QR code

The generated PNG will be served under public/qrcodes/.

2. Command-Line Usage
   Generate a QR code directly from the terminal:

```bash
node index.js <URL> [outputPath]
```

<URL>: The URL or text to encode.

[outputPath]: (Optional) File path to save the QR code. Defaults to ./qrcode-<timestamp>.png.

Example:

```bash
node index.js "https://example.com" "./qrcodes/mycode.png"
```

On success:

```bash
QR code generated successfully at: ./qrcodes/mycode.png

```

Project Structure

```bash
├── index.js           # Main entry point
├── package.json
├── public
│   └── qrcodes        # Generated QR code images
└── README.md
```
