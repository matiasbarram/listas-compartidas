import { NextFunction, Request, Response } from "express"
import validator from "validator"
import Logger from "../../../utils/logger"

interface IBodyFields {
    name: string | null
    email: string | null
    password: string | null
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
    let { email, password }: IBodyFields = req.body
    const errorsValidation = []
    Logger.info("Validating login data")

    email = !email ? "" : email
    password = !password ? "" : password

    if (!validator.isEmail(email)) {
        errorsValidation.push({ email: "Email is invalid" })
    }

    if (validator.isEmpty(email)) {
        errorsValidation.push({ email: "Email field is required" })
    }

    if (validator.isEmpty(password)) {
        errorsValidation.push({ password: "Password field is required" })
    }

    if (errorsValidation.length !== 0) {
        Logger.error("Validation failed")
        const customError = {
            status: 400,
            message: "Validation error",
            errors: errorsValidation,
        }
        return res.status(400).json(customError)
    }

    Logger.info("Validation passed")
    return next()
}

export function validateRegister(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    let { name, email, password }: IBodyFields = req.body
    const errorsValidation = []
    name = !name ? "" : name
    email = !email ? "" : email
    password = !password ? "" : password

    if (!validator.isEmail(email)) {
        errorsValidation.push({ email: "Email is invalid" })
    }

    if (validator.isEmpty(email)) {
        errorsValidation.push({ email: "Email field is required" })
    }

    if (validator.isEmpty(name)) {
        errorsValidation.push({ name: "Name field is required" })
    }

    if (validator.isEmpty(password)) {
        errorsValidation.push({ password: "Password field is required" })
    }

    if (errorsValidation.length !== 0) {
        Logger.error("Validation failed")
        const customError = {
            status: 400,
            message: "Validation error",
            errors: errorsValidation,
        }
        return res.status(400).json(customError)
    }

    return next()
}
