import { Logger } from '@nestjs/common'
import * as fs from 'fs'

export class AppLogger extends Logger {
  private writeLogToFile(fileName: string, data: object) {
    const stringifiedData = '\n' + JSON.stringify(data)
    fs.appendFile(fileName, stringifiedData, console.error)
  }

  error(message: string, trace: string, context: string) {
    this.writeLogToFile('error.log', { context, message, trace })

    super.error(message, trace)
  }
}
