import "dotenv/config" ;
import express, {NextFunction, Request, Response} from "express" ;
import cors from "cors"; 
// import session from "cookie-session";
import { config } from "./config/app.config";
import connectDB from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import "./config/passport.config" ;
import passport from "passport";
import authRotues from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import { passportAuthenticateJWT } from "./config/passport.config";


const app = express() ;
const BASE_PATH = config.BASE_PATH ;

app.use(express.json()) ;
app.use(express.urlencoded({extended: true})) ; 

// app.use(
//     session({
//         name: "session", 
//         keys: [config.SESSION_SECRET],
//         maxAge: 24*60*60*1000,
//         secure: config.NODE_ENV === "production",
//         httpOnly: true,
//         sameSite: "lax",
//     })
// ) ;

app.use(passport.initialize());
// app.use(passport.session());

app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true,
    })
) ;

app.get(`/`, asyncHandler( async(req: Request, res:Response, next:NextFunction)=> {
    return res.status(HTTPSTATUS.OK).json({
        message: "Hello, server is running fine."
    })
}))

app.use(`${BASE_PATH}/auth`, authRotues);
app.use(`${BASE_PATH}/user`, passportAuthenticateJWT, userRoutes);
app.use(`${BASE_PATH}/workspace`, passportAuthenticateJWT, workspaceRoutes);
app.use(`${BASE_PATH}/member`, passportAuthenticateJWT, memberRoutes);
app.use(`${BASE_PATH}/project`, passportAuthenticateJWT, projectRoutes);
app.use(`${BASE_PATH}/task`, passportAuthenticateJWT, taskRoutes);

app.use(errorHandler) ;

app.listen(config.PORT, async()=> {
    console.log(`Server is running at port ${config.PORT} in ${config.NODE_ENV}`);

    await connectDB() ;
})