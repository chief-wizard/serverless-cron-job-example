exports.cleanup = async (client, week, year) => {
    var anyId = await client.query(`select id from weather where YEAR(date)=? and WEEK(date)=?`, [year, week])
    if (anyId.length == 0) {
        console.log(`cleanup did't needed, because does not exists records for year = ${year} and week = ${week}`)
        return
    }
    anyId = await client.query(`select id from weather_${year}_${week} limit 1`, [year, week])
    if (anyId.length == 0) {
        throw Error(`cleanup can't finished, because records are not transfered for year = ${year} and week = ${week} in`)
    }
    await client.query(`
    delete
    from weather 
    where YEAR(date)=? and WEEK(date)=? 
    `, [year, week])
    //console.log(`cleanup for year = ${year} and week = ${week}`)
}