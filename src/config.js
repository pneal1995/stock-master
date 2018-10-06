const importEnv = require('import-env')
 
const config = importEnv(
    {
    name: 'AVAPIKEY',
    alias: 'KEY', 
}
)
module.exports = config
