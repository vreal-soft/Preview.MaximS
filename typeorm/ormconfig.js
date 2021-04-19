const dotenv = require('dotenv-flow')
const path = require('path')

const root = path.join.bind(this, __dirname)
dotenv.config({ path: root('../') })

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrationsTableName: 'migrations-typeorm',
  migrations: ['migration/*.ts'],
  cli: {
    migrationsDir: 'migration',
  },
}
