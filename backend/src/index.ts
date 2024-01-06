import dotenv from "dotenv"
dotenv.config()

import { Application } from "express"
import AppConfig from "./config/appConfig"
import { createServer } from "./server"
import Logger from "./utils/logger"

const PORT = AppConfig.app.port
const app: Application = createServer()

app.listen(PORT, () => {
    Logger.debug(
        `App ${AppConfig.app.name} with api version ${AppConfig.app.apiVersion} is starting`,
    )
    Logger.debug(`Server running on port ${PORT}`)
})
