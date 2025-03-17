import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { googleLoginCallback, loginController, logOutController, registerUserController } from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_CALLBACK_URL}?status=failure`
const authRotues = Router();

authRotues.post("/register", registerUserController);
authRotues.post("/login", loginController);
authRotues.post("/logout", logOutController);

authRotues.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

authRotues.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: failedUrl,
        session: false,
    }),
    googleLoginCallback,   
)

export default authRotues ;