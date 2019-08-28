var init = require('../database/init_data')
const Client = require('serverless-mysql')
exports.func = async () => {
    var client = Client({
        config: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        }
    })
    var year = 2019;
    var month = 7;
    var day = 21;
    var city = 'New York'
    while (month <= 11) {
        while (day <= 30) {
            await init.init(client, year, month, day, city)
            day++
        }
        month++
        day = 1
    }
    client.quit()
    return "success";
}