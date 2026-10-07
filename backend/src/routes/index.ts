import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes'
import usersRoutes from '../modules/users/users.routes';
import hostsRoutes from '../modules/hosts/hosts.routes';
import adminRoutes from '../modules/admin/admin.routes';
import carsRoutes from '../modules/cars/cars.routes';
import meetsRoutes from '../modules/meets/meets.routes';
import uploadRoutes from '../modules/uploads/uploads.routes'
import registrationsRoutes from '../modules/registrations/registration.routes';
// import attendanceRoutes from '../modules/attendance/attendance.routes';
// import subscriptionsRoutes from '../modules/subscriptions/subscriptions.routes';
import paymentsRoutes from '../modules/payments/payments.routes';

const router = Router();
console.log("yes");
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/admin/hosts', hostsRoutes);
router.use('/admin', adminRoutes);
router.use('/cars', carsRoutes);
router.use('/meets', meetsRoutes);
router.use('/upload', uploadRoutes)
// registrations + attendance mount routes nested under /meets/:id/*
router.use('/', registrationsRoutes);
// router.use('/', attendanceRoutes);
// router.use('/subscriptions', subscriptionsRoutes);
router.use('/payments', paymentsRoutes);

export default router;
