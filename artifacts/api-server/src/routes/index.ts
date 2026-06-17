import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import coursesRouter from "./courses";
import exercisesRouter from "./exercises";
import progressRouter from "./progress";
import authRouter from "./auth";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/users", usersRouter);
router.use(coursesRouter);
router.use(exercisesRouter);
router.use(progressRouter);

export default router;
