import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../shared/error/ApiError.js';
import { ROLES } from '../shared/constants/roles.js';

export async function ownsMeetOrIsAdmin(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    if (!req.user) throw new UnauthorizedError();

    if (req.user.role === ROLES.ADMIN) {
        return next();
    }

    const meetId = req.params.id;
    const meetIdValue = Array.isArray(meetId) ? meetId[0] : meetId;

    const meet = await prisma.meet.findUnique({
        where: { id: meetIdValue },
        include: { host: true },
    });

    if (!meet) {
        throw new NotFoundError('Meet not found');
    }

    if (meet.host.userId !== req.user.id) {
        throw new ForbiddenError('You do not have access to this meet');
    }

    next();
}