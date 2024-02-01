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