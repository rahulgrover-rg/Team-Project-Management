import jwt,{ SignOptions} from "jsonwebtoken";
import { UserDocument } from "../models/user.model"
import { config } from "../config/app.config";

export type AccessTPayload = {
    userId: UserDocument["_id"];
};

type SignOptsAndSecret = SignOptions & {
    secret: string;
};

const defaults: SignOptions = {
    audience: "user",
};

export const accessTokenSignOptions: SignOptsAndSecret = {
    expiresIn: config.JWT_EXPIRES_IN as `${number}d` | `${number}h` | `${number}m` ,
    secret: config.JWT_SECRET,
}

export const signJwtToken = (
    payload: AccessTPayload,
    options?: SignOptsAndSecret,
)=>{
    const {secret, ...opts} = options || accessTokenSignOptions;
    console.log("JWT Payload:", JSON.stringify(payload)); 
    const token = jwt.sign(payload, secret, {
        ...defaults,
        ...opts,
    });
    console.log("Generated JWT Token:", token);
    return token;
}