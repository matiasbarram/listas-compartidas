import jwt from "jsonwebtoken";
import { JwtToken } from "../../api/interfaces/interfaces";

export function validateJwt(token: string): JwtToken | string {
    const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
    ) as JwtToken;
    return payload;
}
