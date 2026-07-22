import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { swayenController } from "./swayen.controller";
import { createHobbySchema, spendCoinSchema } from "./swayen.validation";

const router = Router();

router.use(authenticate);

router.get("/balance", swayenController.getBalance);
router.get("/hobbies", swayenController.listHobbies);
router.post("/hobbies", validate(createHobbySchema), swayenController.createHobby);
router.post("/spend", validate(spendCoinSchema), swayenController.spend);

export default router;
