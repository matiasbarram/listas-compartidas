import { Request, Response, Router } from "express"

import { login } from "../../controllers/auth/login"
import { register } from "../../controllers/auth/register"
import { checkJwt } from "../../middlewares/auth/checkJwt"
import { validateLogin, validateRegister } from "../../middlewares/auth/login"
import { payloadData } from "../../../utils/jwt/payloadData"
import { loginGoogle } from "../../controllers/auth/google"

const authRouter: Router = Router()

authRouter.route("/me").get([checkJwt], (req: Request, res: Response) => {
    const payload = payloadData(req, res)
    return res.status(200).json({ payload })
})
authRouter.route("/google").post(loginGoogle)
authRouter.route("/login").post([validateLogin], login)
authRouter.route("/register").post([validateLogin], register)

authRouter.route("/verify").get([checkJwt], (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Verified",
    })
})

export default authRouter
