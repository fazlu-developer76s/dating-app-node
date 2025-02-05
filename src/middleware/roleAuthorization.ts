import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responses';
import { verifyToken } from '../utils/generateToken';

const roleAuthorization = (allowedRoles: string | any[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json(errorResponse('NOK', 'error', 'Unauthorized: No token provided'));
            return;
        }
        try {
            let tokenVerify = verifyToken(token);
            let tokenParse = JSON.parse(tokenVerify.id);
            const userRole = tokenParse.role;
            req.authUser = tokenParse
            if (!userRole || !allowedRoles.includes(userRole)) {
                res.status(403).json(errorResponse('NOK', 'error', 'Forbidden'));
                return;
            }

            next();
        } catch (error: any) {
            if (error.message === "Token has expired") {
                res.status(401).json(errorResponse('NOK', 'error', 'Unauthorized: Token has expired'));
            } else {
                res.status(401).json(errorResponse('NOK', 'error', 'Unauthorized: Invalid token'));
            }
        }

    };
};

export default roleAuthorization;
