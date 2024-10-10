const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // Build file path
    let filePath = path.join(__dirname, 'views', 'public', req.url === '/' ? 'index.html' : req.url);

    console.log('Requested URL:', req.url);
    console.log('File path being served:', filePath);

    // extension of file
    let extname = path.extname(filePath);

    // Iniital content type
    let contentType = 'text/html';



    // Check ext and set content type
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    if (contentType === 'text/html') {
        if (!filePath.includes('.html')) {

            filePath += '.html';
        }
    }

    // Read File
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found
                fs.readFile(path.join(__dirname, 'views', 'public', '404.html'), (err, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                })
            } else {
                // some server error (5xx)
                res.writeHead(500);
                res.end(`Server error: ${err.code}`);
            }

        } else {
            // Success 
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }

    })



});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));