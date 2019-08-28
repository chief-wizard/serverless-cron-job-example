exports.transfer = async (client, week, year) => {
    var anyId = await client.query(`select id from weather where YEAR(date)=? and WEEK(date)=?`, [year, week])
    if (anyId.length == 0) {
        console.log(`records does not exists for year = ${year} and week = ${week}`)
        return
    }
    await client.query(`
    INSERT INTO weather_${year}_${week}
    (date, city, temperature)
    select date, city, temperature 
    from weather
    where YEAR(date)=? and WEEK(date)=? 
    `, [year, week])
    //console.log(`transfer data for year = ${year} and week = ${week}`)
}