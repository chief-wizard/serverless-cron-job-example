var assert = require('assert');
var dateUtil = require('../utils/date')
describe('Date utils test', function () {
    describe('#getWeekNumber(d)', function () {
        it('should return week = 33 and year = 2018 for 2018/08/21', function () {
            var weeknumber = dateUtil.getWeekNumber(new Date(2018, 7, 21))
            assert.equal(weeknumber[0], 2018);
            assert.equal(weeknumber[1], 33);
        });
    });
});