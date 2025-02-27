import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { googleLoginCallback, registerUserController } from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_CALLBACK_URL}?status=failure`
const authRotues = Router();

authRotues.post("/register", registerUserController);

authRotues.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

authRotues.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: failedUrl,
    }),
    googleLoginCallback,   
)

export default authRotues ;