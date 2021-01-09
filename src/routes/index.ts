import express, { Request, Response } from "express";
import { NameCategoryModel } from "src/models/categories/Name";
import RoomRoutes from "./RoomRoutes";

const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({ health_status: "OK" });
});

router.use("/rooms", RoomRoutes);

export default router;
