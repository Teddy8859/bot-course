const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telegabot',
    'meganfox',
    'Ted8956125',
    {
        host: '5.188.129.91',
        port: '6432',
        dialect: 'postgres'
    }
)
