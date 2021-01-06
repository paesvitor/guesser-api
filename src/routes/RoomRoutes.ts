import express from "express";
import { RoomController } from "@controllers/roomController";

const router = express.Router();

router.get("/", RoomController.list);
router.post("/", RoomController.create);
router.post("/:code", RoomController.join);
router.post("/:code/next-round", RoomController.startNextRound);
router.post("/:code/answer", RoomController.answer);
router.post("/:code/finish-round", RoomController.finishCurrentRound);
router.post("/:code/restart", RoomController.restart);
router.post("/:code/disconnect", RoomController.disconnect);

export default router;
