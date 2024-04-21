import express from "express";

const postRouter = express.Router();

postRouter.get("/test", (req, res) => {
    res.send("Router works");
});

export default postRouter;