const fs = require('fs')
const { flow } = require('power-helper')

flow.run(async() => {
    fs.cpSync('./main.js', './dist/main.js')
    process.exit()
})
