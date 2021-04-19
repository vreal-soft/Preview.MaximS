import { config } from 'dotenv-flow'
import * as path from 'path'

const root = path.join.bind(this, __dirname)
config({ path: root('../../') })

export default {
  PORT: process.env.PORT || 5001,
  JWT_SECRET: process.env.JWT_SECRET,
  APP_ENV: process.env.APPLICATION_ENV,
  GITHUB: {
    token: process.env.GITHUB_TOKEN,
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    root_repository: process.env.GITHUB_ROOT_REPOSITORY,
  },
  AWS: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    apiVersion: process.env.AWS_VERSION,
    region: process.env.AWS_REGION,
  },
  S3: {
    BUCKETS: {
      APPS: process.env.S3_APPS_BUCKET,
    },
  },
  DB: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  GOOGLE: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
  },
}
