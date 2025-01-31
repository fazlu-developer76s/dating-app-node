import joi from 'joi';

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});

const serviceSchema = joi.object({
    name: joi.string().required(),
    price: joi.number().required(),
    available: joi.boolean(),
    description: joi.string(),
    duration: joi.string().required(),
    features: joi.array()
});

const lookingSchema = joi.object({
    name: joi.string().required(),
    image: joi.string(),
    available: joi.boolean().default(true).required()
});

const statusCategoriesSchema = joi.object({
    name: joi.string().required(),
    image: joi.string(),

    available: joi.boolean().default(true).required()
});

const meetingSchema = joi.object({
    name: joi.string().required(),
    image: joi.string(),

    available: joi.boolean().default(true).required()
});

const sexualOrientationSchema = joi.object({
    name: joi.string().required(),
    image: joi.string(),

    available: joi.boolean().default(true).required()
});

const interestSchema = joi.object({
    image: joi.string(),
    name: joi.string().required(),
    available: joi.boolean().default(true).required()
});

const languageSchema = joi.object({
    image: joi.string(),
    name: joi.string().required(),
    available: joi.boolean().default(true).required()
});

const privitermSchema = joi.object({
    description: joi.string().required(),
    title: joi.string().valid('terms condition', 'privacy policy').required(),
    status: joi.boolean().default(true).required()
});
const peferenceSchema = joi.object({
    name: joi.string().required(),
    value: joi.string().default(true).required()
});

const faqSchema = joi.object({
    question: joi.string().required(),
    answer: joi.string().required(),
    status: joi.boolean().default(true).required()
});

const habitsSchema = joi.array().items(
    joi.object({
        type: joi.string()
            .valid('drinking', 'smoking')
            .required(),
        value: joi.string().when('type', {
            is: 'drinking',
            then: joi.valid(
                "Yes, I drink",
                "I rarely drink",
                "No, I don't drink",
                "I'm sober",
                "I drink sometimes"
            ).required(),
            otherwise: joi.when('type', {
                is: 'smoking',
                then: joi.valid(
                    "Yes, I smoke",
                    "No, I don’t smoke",
                    "I'm trying to quit",
                    "I smoke sometimes"
                ).required(),
                otherwise: joi.forbidden()
            })
        })
    })
);

export { peferenceSchema, faqSchema, loginSchema, privitermSchema, habitsSchema, serviceSchema, lookingSchema, statusCategoriesSchema, interestSchema, sexualOrientationSchema, meetingSchema, languageSchema };