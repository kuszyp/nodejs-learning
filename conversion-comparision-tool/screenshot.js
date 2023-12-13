const StreamArray = require('stream-json/streamers/StreamArray')
const jsonStream = StreamArray.withParser()
const fs = require("fs")
const path = require('path')
const puppeteer = require('puppeteer')

fs.createReadStream('Converted_pages_comparison_data.json').pipe(jsonStream.input)

const images = [];
jsonStream.on('data', ({key, value}) => {

    const imageName = (value.leftPageSeq + "_" + value.leftLangID).replace(/[^A-Z0-9]/ig, "_") + ".jpg";
    const oldUrl = `https://lcb-asterix.cordonbleu.edu/index.cfm?fa=Webmod.ShowWebPage&seq=${value.leftPageSeq}&rev=${value.leftRevision}&langid=${value.leftLangID}&pagemode=lcbhistory`
    const newUrl = `https://lcb-asterix.cordonbleu.edu/index.cfm?fa=Webmod.ShowWebPage&seq=${value.leftPageSeq}&rev=${value.rightRevision}&langid=${value.leftLangID}`

    images.push({
        image: imageName,
        oldUrl: oldUrl,
        newUrl: newUrl
    })

});

jsonStream.on('end', (err) => {
    console.log(`Processing ${images.length} images`)
    screenshot();
});

process.on('uncaughtException', err => {
    console.error(`There was an unexpected error: ${err}`);
    // process.exit(1);
})

const screenshot = async () => {
    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1920, height: 2000 });

    for (var i = 0; i < images.length; i++) {
        if (!fs.existsSync(path.join(__dirname, 'old', images[i].image))) {
            await page.goto(images[i].oldUrl, { waitUntil: 'networkidle0' })
            await page.screenshot({ path: path.join(__dirname, 'old', images[i].image), fullPage: true, quality: 60, type: 'jpeg' })
        }

        if (!fs.existsSync(path.join(__dirname, 'new', images[i].image))) {
            await page.goto(images[i].newUrl, { waitUntil: 'networkidle0' })
            await page.screenshot({ path: path.join(__dirname, 'new', images[i].image), fullPage: true, quality: 60, type: 'jpeg' })
        }
    }

    // Close the browser instance
    await browser.close();
};