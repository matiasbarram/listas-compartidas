import cors from "cors"
import express, { Application } from "express"
import routesV1 from "./api/routes/v1"

import AppConfig from "./config/appConfig"

export function createServer(): Application {
    const app = express()
    const corsOptions = {
        origin: "*",
        credentials: true,
    }

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cors(corsOptions))
    app.use(`/api/${AppConfig.app.apiVersion}`, routesV1)

    return app
}
