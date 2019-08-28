exports.create = async (client, week, year) => {

    await client.query(`
    CREATE TABLE IF NOT EXISTS weather_${year}_${week}
    (
        id MEDIUMINT UNSIGNED not null AUTO_INCREMENT, 
        date TIMESTAMP,
        city varchar(100) not null, 
        temperature int not null, 
        PRIMARY KEY (id)
    );  
    `)
    //console.log(`created table weather_${year}_${week}`)
}