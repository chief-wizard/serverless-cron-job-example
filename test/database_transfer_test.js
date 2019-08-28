var assert = require('assert');
var fs = require("fs")
var dateUtil = require('../utils/date')
var monthTable = require('../database/create_month_table')
var transferData = require('../database/transfer_data')
var cleanupData = require('../database/cleanup_data')
var init = require('../database/init_data')
const Client = require('serverless-mysql')
const secrets = JSON.parse(fs.readFileSync("secrets.json"));
describe('Transfer test', function () {
    var client = Client({
        config: {
            host: secrets.DB_HOST,
            database: secrets.DB_NAME,
            user: secrets.DB_USER,
            password: secrets.DB_PASS
        }
    })
    // test data
    var year = 2018;
    var month = 7;
    var day = 21;
    var city = 'New York'
    var date = new Date(year, month, day, 10, 0, 0);
    var weeknumber = dateUtil.getWeekNumber(date)
    var week = weeknumber[1];
    var year = weeknumber[0];
    var timestamp = date.getTime() / 1000

    describe('#init(client, year, month, day, city)', function () {
        it('exists record for 2018/08/21', async function () {
            await init.init(client, year, month, day, city)
            var anyId = await client.query(`select id from weather where city=? and date=FROM_UNIXTIME(?) limit 1`, [city, timestamp])
            assert.equal(anyId.length, 1);
        });
    });
    describe('#monthTable.create(client, week, year)', function () {
        it('exists new table for week = 33 and year = 2018', async function () {
            await client.query(`drop table if exists weather_${year}_${week}`)
            await monthTable.create(client, week, year)
            var anyId = await client.query(`SELECT table_schema db,table_name tb  FROM information_schema.TABLES
            where table_name='weather_${year}_${week}'`)
            assert.equal(anyId.length, 1);
        });
    });
    describe('#transferData.transfer(client, week, year)', function () {
        it('exists record in new and old table for week = 33 and year = 2018', async function () {
            await transferData.transfer(client, week, year)
            var anyId = await client.query(`select id from weather where city=? and date=FROM_UNIXTIME(?) limit 1`, [city, timestamp])
            assert.equal(anyId.length, 1);
            anyId = await client.query(`select id from weather_${year}_${week} where city=? and date=FROM_UNIXTIME(?) limit 1`, [city, timestamp])
            assert.equal(anyId.length, 1);
        });
    });
    describe('#cleanupData.cleanup(client, week, year)', function () {
        it('exists record in new table and not exists in old table for week = 33 and year = 2018', async function () {
            await cleanupData.cleanup(client, week, year)
            var anyId = await client.query(`select id from weather where city=? and date=FROM_UNIXTIME(?) limit 1`, [city, timestamp])
            assert.equal(anyId.length, 0);
            anyId = await client.query(`select id from weather_${year}_${week} where city=? and date=FROM_UNIXTIME(?) limit 1`, [city, timestamp])
            assert.equal(anyId.length, 1);
        });
    });
    client.quit()
});