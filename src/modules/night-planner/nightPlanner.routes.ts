import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { nightPlannerController } from "./nightPlanner.controller";
import { createNightPlanSchema, completeNightPlanSchema, toggleNightTaskSchema } from "./nightPlanner.validation";

const router = Router();

router.use(authenticate);

router.post("/", validate(createNightPlanSchema), nightPlannerController.create);
router.get("/today", nightPlannerController.getToday);
router.patch("/:id/complete", validate(completeNightPlanSchema), nightPlannerController.complete);
router.patch("/:id/tasks/:taskIndex", validate(toggleNightTaskSchema), nightPlannerController.toggleTask);

export default router;
