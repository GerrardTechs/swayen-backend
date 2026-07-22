import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { timeboxController } from "./timebox.controller";
import { startTimeBoxSchema, finishTimeBoxSchema, startWuxiuSchema } from "./timebox.validation";

const router = Router();

router.use(authenticate);

router.post("/start", validate(startTimeBoxSchema), timeboxController.start);
router.post("/finish", validate(finishTimeBoxSchema), timeboxController.finish);
router.post("/wuxiu", validate(startWuxiuSchema), timeboxController.wuxiu);

export default router;
