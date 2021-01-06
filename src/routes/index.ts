import express, { Request, Response } from "express";
import { NameCategoryModel } from "src/models/categories/Name";
import RoomRoutes from "./RoomRoutes";

const router = express.Router();

router.use("/rooms", RoomRoutes);
router.use("/delete-records", async (req: Request, res: Response) => {
  await NameCategoryModel.deleteMany({ ate2010: "" });
});

export default router;
