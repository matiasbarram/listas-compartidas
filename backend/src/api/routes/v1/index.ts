import { Router } from 'express';
import mainRouter from './main';
import authRouter from './auth';
import privateRouter from './private';


const router: Router = Router();
router.use('/', mainRouter);
router.use('/auth', authRouter);
router.use('/private', privateRouter);

export default router;