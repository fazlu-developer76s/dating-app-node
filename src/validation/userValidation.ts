import joi, { ObjectSchema } from 'joi';

const registerSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string().required(),
    provider: joi.string().default('local'),
    role: joi.string().default('user'),
    gender: joi.string().valid('male', 'female', '').required(),
    dob: joi.date().less('now').required(),
    lookingFor: joi.array(),
    meetingFor: joi.array(),
    password: joi.string().min(6).required()
});

const generateOtpSchema = joi.object({
    type: joi.string().valid("email", "phoneNumber").required(),
    email: joi.string().email().when('type', {
        is: 'email',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    phoneNumber: joi.string().when('type', {
        is: 'phoneNumber',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
});


const verifyLoginOtpSchema = joi.object({
    phoneNumber: joi.string().required(),
    otp: joi.number().required()
})
const verifyOtpSchema = joi.object({
    type: joi.string().valid("email", "phoneNumber").required(),
    otp: joi.number().required(),
    email: joi.string().email().when('type', {
        is: 'email',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    phoneNumber: joi.string().when('type', {
        is: 'phoneNumber',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
});

const loginSchema = joi.object({
    phoneNumber: joi.string().required(),
});

const senderFollowRequest = joi.object({
    receiverId: joi.string().required()
});

const blockUnblockSchema = joi.object({
    reciverUserId: joi.string().required(),
    status: joi.string().valid('match', 'unblock', 'block').required(),
});
const userUnblockSchema = joi.object({
    status: joi.string().valid('unblock').required(),
});

const responseFollowRequest = joi.object({
    receiverId: joi.string().required(),
});

const cancelFollowRequestSchema = joi.object({
    userIdToUnfollow: joi.string().required(),
});


const profileSchema = joi.object({
    profilePic: joi.string(),
    phoneNumber: joi.string().required(),
    address: joi.string().required(),
    gender: joi.string().required(),
    dob: joi.string().required(),
    education: joi.string().required(),
    relationShip: joi.string().valid('single', 'married', 'widowed', 'divorced', 'separated', 'engaged').required()
});

const privacySettingsSchema = joi.object({
    hideEmail: joi.boolean().required(),
    hidePhoneNumber: joi.boolean().required(),
    hideDob: joi.boolean().required(),
    hideAddress: joi.boolean().required(),
    hideGender: joi.boolean().required(),
});

const step3Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(3).required(),
    name: joi.string().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
    email: joi.string().email().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
    dob: joi.string().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
});

const step4Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(4),
    gender: joi.string().valid("male", "female", "").required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
});

const step5Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(5).required(),
    hideGender: joi.boolean().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
});

const step6Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(6).required(),
    lookingFor: joi.array().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
});

const step7Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(7).required(),
    meetingFor: joi.array().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
});

const step8Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(8).required(),
    sexualOrientation: joi.array().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
    // hidesexualOrientation: joi.boolean().required().when('isSkip', {
    //     is: false,
    //     then: joi.required(),
    //     otherwise: joi.optional()
    // }),
});

const step9Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(9).required(),
    isKid: joi.boolean().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
    kids: joi.string().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
});

const step10Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(10).required(),
    stausCatogry: joi.array().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
});

const step11Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(11).required(),
    drinking: joi.string().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
    smoking: joi.string().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
});

const step12Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(12).required(),
    height: joi.number().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    })
});

const step13Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(13).required(),
    language: joi.array().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    })
});

const step14Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(14).required(),
    collegeName: joi.string().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    })
});

const step15Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(15).required(),
    covid: joi.number().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    })
});

const step16Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(16).required(),
    company: joi.string().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
    profession: joi.string().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    }),
    salary: joi.number().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    })
});

const step17Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(17).required(),
    zodiac: joi.string().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    })
});

const step18Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(18).required(),
    interest: joi.array().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    })
});

const step19Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(19).required(),
    distance: joi.number().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    })
});
const step20Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(20).required(),
    address: joi.string(),
    location: joi.object({
        type: joi.string().valid('Point').default('Point').required(),
        coordinates: joi.array().ordered(
            joi.number().required(),
            joi.number().required()
        ).length(2).required()
    }).when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    })
});

const step21Schema = joi.object({
    isSkip: joi.boolean().required(),
    step: joi.number().valid(21).required(),
    media: joi.string().required().when('isSkip', {
        is: false,
        then: joi.required(),
        otherwise: joi.optional()
    })
});

const registerSchemaStep = (step: number): ObjectSchema => {
    switch (step) {
        case 3:
            return step3Schema;
        case 4:
            return step4Schema;
        case 5:
            return step5Schema;
        case 6:
            return step6Schema;
        case 7:
            return step7Schema;
        case 8:
            return step8Schema;
        case 9:
            return step9Schema
        case 10:
            return step10Schema
        case 11:
            return step11Schema
        case 12:
            return step12Schema
        case 13:
            return step13Schema
        case 14:
            return step14Schema
        case 15:
            return step15Schema
        case 16:
            return step16Schema
        case 17:
            return step17Schema
        case 18:
            return step18Schema
        case 19:
            return step19Schema
        case 20:
            return step20Schema
        case 21:
            return step21Schema
        default:
            return joi.object(); // Return an empty schema for unknown steps
    }
};

const followRequestSchema = joi.object({
    toUser: joi.string().required(),
});

const followAcceptDeclineSchema = joi.object({
    fromUser: joi.string().required(),
    status: joi.string().valid('pending', 'accepted', 'declined').required(),
})

export { userUnblockSchema, blockUnblockSchema, senderFollowRequest, registerSchema, cancelFollowRequestSchema, loginSchema, responseFollowRequest, profileSchema, privacySettingsSchema, generateOtpSchema, verifyOtpSchema, verifyLoginOtpSchema, registerSchemaStep, followRequestSchema, followAcceptDeclineSchema };