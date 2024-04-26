import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoute from "./route/auth.route.js";
import postRoute from "./route/post.route.js";
import testRoute from "./route/test.route.js";

const app = express();
const port = 8800;

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(express.json());
app.use(cookieParser()); //Json web token


// app.use("/api/test", (req, res) => {
//     console.log("Test route hit");
//     res.send("It works");
// });

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});