import { getEnv } from "../utils/get-env";

const appConfig = () => ({
    NODE_ENV: getEnv("NODE_ENV", "development") ,
    PORT: getEnv("PORT", "5000"), 
    BASE_PATH: getEnv("BASE_PATH", "/api"),
    MONGO_URL: getEnv("MONGO_URL", ""),
    
    SESSION_SECRET: getEnv("SESSION_SECRET"),
    SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN"),
    
    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CLIENT_ID"),
    
    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
    FRONTEND_CALLBACK_URL: getEnv("FRONTEND_CALLBACK_URL"),
}) ;

export const config = appConfig() ;
