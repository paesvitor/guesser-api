import express, { Request, Response } from "express";
import { NameCategoryModel } from "src/models/categories/Name";
import RoomRoutes from "./RoomRoutes";

const router = express.Router();

router.use("/rooms", RoomRoutes);

export default router;
