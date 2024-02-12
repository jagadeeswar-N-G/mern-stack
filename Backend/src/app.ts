import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

export const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN  // we are just allowing the frontend from this origin
}))

app.use(express.json({limit: "16kb"}))  // we are just accepting this much json 
app.use(express.urlencoded({extended:true, limit: "16kb"})) // we setting up the url limit
app.use(cookieParser())


//routes
import userRouter from "./routes/userRouter.ts"
import tweetRouter from "./routes/tweetRoutes.ts";
import videoRouter from "./routes/videoRouter.ts"



// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/videos", videoRouter);


