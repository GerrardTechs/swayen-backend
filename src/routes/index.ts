import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import usersRoutes from "../modules/users/users.routes";
import nightPlannerRoutes from "../modules/night-planner/nightPlanner.routes";
import timeboxRoutes from "../modules/timebox/timebox.routes";
import swayenRoutes from "../modules/swayen/swayen.routes";
import systemRoutes from "../modules/system/system.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", usersRoutes);
apiRouter.use("/night-planner", nightPlannerRoutes);
apiRouter.use("/timebox", timeboxRoutes);
apiRouter.use("/swayen", swayenRoutes);
apiRouter.use("/system", systemRoutes);
