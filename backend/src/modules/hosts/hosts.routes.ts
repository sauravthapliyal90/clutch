import {Router} from 'express';
import {hostsController} from './hosts.controller'
import { authenticate } from '@middleware/auth.middleware';
import { authorize } from '@middleware/authorize.middleware';
import { ROLES } from '@shared/constants/roles';
import { validate } from '@middleware/validate.middleware';
import { approveHostSchema } from './hosts.validation';
import { paginationSchema } from '@shared/pagination/pagination';

const router = Router();

router.post('/approve', authenticate, authorize([ROLES.ADMIN]), validate(approveHostSchema), hostsController.approve);

router.get('/', authenticate, authorize([ROLES.ADMIN]), validate(paginationSchema, 'query'), hostsController.list)


export default router;