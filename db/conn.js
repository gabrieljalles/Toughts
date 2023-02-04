const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('toughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})

try{
    sequelize.authenticate()
    console.log('Conectamos com sucesso ao banco de dados!')
} catch(err){
    console.log(`Houve um erro ao conectar o banco de dados: ${err}`)
}

module.exports = sequelize