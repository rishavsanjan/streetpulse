import { Router } from "express";
import { authMiddleware } from "../middleware/middleware.js";
import { createEventController, deleteEventController, getEventController, getEventDetailController, updateEventController } from "../controllers/event.cntroller.js";


const router = Router();

router.post("", authMiddleware, createEventController)
router.get("",  getEventController)

router.get("/:id", authMiddleware, getEventDetailController)
router.patch("", authMiddleware, updateEventController)
router.delete("/:id", authMiddleware, deleteEventController)


export default router