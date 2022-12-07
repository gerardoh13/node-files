const fs = require('fs');
const process = require('process');
const axios = require('axios');


function outPut(text, out) {
    if (out) {
        fs.writeFile(out, text, 'utf8', function (error) {
            if (error) {
                console.error(`Couldn't write ${out}: ${error}`);
                process.exit(1);
            }
        });
    } else {
        console.log(text)
    }
}

function handleErr(error, path, method) {
    console.error(`Error ${method} ${path}: ${error}`);
    process.exit(1);
}

function cat(path, out) {
    fs.readFile(path, 'utf8', function (error, data) {
        if (error) {
            handleErr(error, path, "reading")
        } else {
            outPut(data, out)
        }
    });
}

async function webCat(url, out) {
    try {
        let res = await axios.get(url)
        outPut(res.data, out)
    } catch (error) {
        handleErr(error, path, "fetching")
    }
}

let path;
let out;

if (process.argv[2] === '--out') {
    out = process.argv[3];
    path = process.argv[4];
} else {
    path = process.argv[2];
}

if (path.slice(0, 4) === 'http') {
    webCat(path, out);
} else {
    cat(path, out);
}
