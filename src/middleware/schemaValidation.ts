import { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responses';
import { registerSchemaStep } from '../validation/userValidation';

const validateSchema = (schema: ObjectSchema) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            console.log('*** Validation error ***', error);
            const errorDetails = error.details.map((detail) => ({
                message: detail.message,
                path: detail.path, 
                type: detail.type,
              }));
            res.status(400).json(errorResponse('NOK', errorDetails, 'Insert correct value'));
            return;
        }
        next();
    };

export { validateSchema };

const validateSchemaStep = () =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const step = req.body.step;
        if (step) {
            const schema: ObjectSchema = registerSchemaStep(step);
            const { error } = schema.validate(req.body);

            if (error) {
                console.log('*** Validation error ***', error);
                res.status(400).json(errorResponse('NOK', error.details, 'Insert correct value'));
                return;
            }

            next();
        } else {
            next();
        }
    }
export { validateSchemaStep };
