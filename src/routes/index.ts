import express from "express";
import RoomRoutes from "./RoomRoutes";

const router = express.Router();

router.use("/rooms", RoomRoutes);

export default router;
