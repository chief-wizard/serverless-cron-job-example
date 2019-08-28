var monthTable = require('../database/create_month_table')
var transferData = require('../database/transfer_data')
var cleanupData = require('../database/cleanup_data')
var dateUtil = require('../utils/date')
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
    var weeknumber = dateUtil.getWeekNumber(new Date())
    var currentWeek = weeknumber[1];
    var currentYear = weeknumber[0];
    try {
        console.log(`start transfer for year = ${currentYear} and week = ${currentWeek}`)
        await monthTable.create(client, currentWeek, currentYear)
        console.log(`table created for year = ${currentYear} and week = ${currentWeek}`)
        await transferData.transfer(client, currentWeek, currentYear)
        console.log(`data transfered for year = ${currentYear} and week = ${currentWeek}`)
        await cleanupData.cleanup(client, currentWeek, currentYear)
        console.log(`old data removed for year = ${currentYear} and week = ${currentWeek}`)
        console.log(`end transfer for year = ${currentYear} and week = ${currentWeek}`)
    } catch (error) {
        if (error.sqlMessage) {
            console.log('sql error:', error.sqlMessage)
        } else {
            console.log('error:', error)
        }
        console.log(`end transfer with error for year = ${currentYear} and week = ${currentWeek}`)
    }
    client.quit()
    return "success";
}

