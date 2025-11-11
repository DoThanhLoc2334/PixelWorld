
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



turngridtofile(grid);

const server = http.createServer(async (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    let gridjson = readgridfromfile();
    console.log(gridjson);
    if (req.method == 'GET') {
        res.end(gridjson);
    }
    if (req.method == "POST") {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
            if (data.length > 1e6) {
                req.socket.destroy();
            }
        });
        console.log('data is: ' + data);
        try
        {
        let postedcell = JSON.parse(data);
        console.log(postedcell);
        let grid = fs.readFile('./grid.txt');
        console.log(grid);
        grid[postedcell[indexX]][postedcell[indexY]] = postedcell[color];
        turngridtofile(grid)
        req.on('end', () => { console.log(data) });
        res.end('post success');
        }catch(err)
        {
            res.end('post failed');
            console.log(err);
        }
        
    }

})

function turngridtofile(grid)
{
let gridjson = JSON.stringify(grid);

fs.writeFile('.\\grid.txt', gridjson, err => { if (err) { console.log(err); } });
}

function readgridfromfile()
{
    let griddata = '';
    griddata = new String(fs.readFileSync('./grid.txt')).toString(); 
    console.log(griddata);
    return griddata;
}

server.listen(port, hostname, () => { console.log('server is running') });