
import http from 'node:http'
import fs from 'node:fs'

const hostname = 'localhost';
const port = 8080;

let grid = Array(20);
for (let i = 0; i < 20; i++) {
    grid[i] = Array(20)
    for (let j = 0; j < 20; j++) {
        grid[i][j] = 0;
    }
}



let gridjson = JSON.stringify(grid);

fs.writeFile('C:\\Users\\Bumchic\\Documents\\GitHub\\PixelWorld\\Server\\grid.txt', gridjson, err => { if (err) { console.log(err); } });

const server = http.createServer((req, res) => {
    if (req.method == 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.end(gridjson);
    }
    if(req.method == "POST")
    {
        
    }

})

server.listen(port, hostname, () => { console.log('server is running') });