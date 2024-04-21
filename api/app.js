import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./route/auth.route.js";
import postRoute from "./route/post.route.js";

const app = express();
const port = 8800;

app.use(express.json());
app.use(cookieParser())

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);

console.log("test");

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});