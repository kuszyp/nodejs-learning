const StreamArray = require('stream-json/streamers/StreamArray')
const fs = require("fs")
const path = require('path')
const jsonStream = StreamArray.withParser()

process.setMaxListeners(10);

// create output directories
if (!fs.existsSync(path.join(__dirname, 'old'))) {
    fs.mkdir(path.join(__dirname, 'old'), (err) => {
        if (err) throw err
    })
}

if (!fs.existsSync(path.join(__dirname, 'new'))) {
    fs.mkdir(path.join(__dirname, 'new'), (err) => {
        if (err) throw err
    })
}

//internal Node readable stream option, pipe to stream-json to convert it
fs.createReadStream('Converted_pages_comparison_data.json').pipe(jsonStream.input)

//get json objects; key is the array-index
jsonStream.on('data', ({key, value}) => {
    const tempFileName = `${value.leftPageSeq}_${value.leftLangID}_${value.rowLayout}_${value.order}`
    const fileName = tempFileName.replace(/[^A-Z0-9]/ig, "_") + ".txt"
    if (!fs.existsSync(path.join(__dirname, 'old', fileName))) {
        const wsOld = fs.createWriteStream(path.join(__dirname, 'old', fileName))
        wsOld.write(value.leftJSON)
        wsOld.close()
    }

    if (!fs.existsSync(path.join(__dirname, 'new', fileName))) {
        const wsNew = fs.createWriteStream(path.join(__dirname, 'new', fileName))
        wsNew.write(value.rightJSON)
        wsNew.close()
    }
});

jsonStream.on('end', () => {
    console.log('All Done');
});

process.on('uncaughtException', err => {
    console.error(`There was an unexpected error: ${err}`);
    process.exit(1);
})