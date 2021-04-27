const puppeteer = require('puppeteer');
const express = require('express');
const app = express()
const fs = require('fs')
let json = {
    webhash: "",
    token: ""
}
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }     
const {createHash} = require('crypto');
function computeSHA256(lines) {
  const hash = createHash('sha256');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim(); // remove leading/trailing whitespace
    if (line === '') continue; // skip empty lines
    hash.write(line); // write a single line to the buffer
  }
  return hash.digest('base64'); // returns hash as string
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/data.install/index.htm')
})
app.get('/createuser', function (req, res) {
    res.sendFile(__dirname + '/data.install/createuser.html')
})
app.get('/postcreeruser', function (req, res) {
    let user = req.query.user
    let pass = req.query.pass
    let text = user + "p" + pass
    console.log(req.query)
    console.log(text)
    let hash = computeSHA256(text) + "p"
    json.webhash = hash
    console.log(json)
    res.sendFile(__dirname + '/data.install/usercreated.htm')
})
app.get('/gettoken', function (req, res) {
    res.sendFile(__dirname + '/data.install/entertoken.html')
})
app.get('/tokenget', function (req, res) {
    let token = req.query.token
    json.token = token
    console.log(json)
    res.sendFile(__dirname + '/data.install/tokenget.htm')
})
app.get('/end', async function (req, res) {
    let data = JSON.stringify(json)
    await fs.writeFile('config.json', data, function(erreur) {
        if (erreur) {
            res.send(erreur)} else {
                process.exit(0)
            }
    })
    

})
app.listen(4589, () => {
    console.log(`Server started on port 4589`);
});

(async () => {
const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null
 })
const page = await browser.newPage();
await page.goto('http://localhost:4589')

  
})();