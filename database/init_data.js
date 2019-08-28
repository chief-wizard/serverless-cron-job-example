exports.init = async (client, year, month, day, city) => {
    await client.query(`
    CREATE TABLE IF NOT EXISTS weather
    (
        id MEDIUMINT UNSIGNED not null AUTO_INCREMENT, 
        date TIMESTAMP,
        city varchar(100) not null, 
        temperature int not null, 
        PRIMARY KEY (id)
    );  
    `)
    var date = new Date(year, month, day, 10, 0, 0);
    var timestamp = date.getTime() / 1000

    var anyId = await client.query(`select id from weather where city=? and date=FROM_UNIXTIME(?) limit 1`, [city, timestamp])
    if (anyId.length == 0) {
        await client.query('INSERT INTO weather (date, city, temperature) VALUES(FROM_UNIXTIME(?), ?, ?)',
            [timestamp, city, randomInt(0, 35)]);
        //console.log('success created', date)
    } else {
        //console.log('already exists', date)
    }
}
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}