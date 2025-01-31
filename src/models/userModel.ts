import mongoose, { Schema, Document, Model } from "mongoose";
import { config } from "../config/config";

export interface IUser extends Document {
    _id: string
    name: string
    email: string;
    step: number;
    socialId: string;
    provider: 'google' | 'facebook' | 'local';
    password: string;
    status: boolean;
    role: string;
    // screen 9
    isKid: boolean;
    kids: string;
    // 
    distance: number,
    // screen 7
    lookingFor: [];
    language: [];
    // screen 8
    meetingFor: [];
    habit: [];
    height: number;
    phoneNumber: string;
    profilePic: string;
    media: [];
    // screen 6
    sexualOrientation: [],
    interest: [],
    address: string;
    gender: string;
    zodiac: object;
    dob: string;
    education: string;
    relationShip: string;
    privacySettings: {
        hideEmail: boolean;
        hidePhoneNumber: boolean;
        hideDob: boolean;
        hideAddress: boolean;
        hideGender: boolean;
        // screen 6
        hidesexualOrientation: boolean
    };
    refreshToken: string;
    company: string
    profession: string
    salary: number
    // screen 10
    stausCatogry: [],
    // screen 11
    drinking: string,
    smoking: string,
    collegeName: string,
    covid: number
    loginStatus: number; // 0 = offline, 1 = online
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    isPrivate: boolean;
    about: string;

    socialAcc: [{ name: string, value: string }
    ];

}

const mapToName = (type: 'covid', value: number) => {
    const foundItem = config[type].find(item => item.value === value);
    return foundItem ? foundItem.name : 'Unknown'; // Default to 'Unknown' if not found
};


const userSchema: Schema = new Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    step: { type: Number, default: null },
    password: { type: String, default: null },
    socialId: { type: String, default: null },
    isKid: { type: Boolean, default: false },
    drinking: { type: String, default: null },
    smoking: { type: String, default: null },
    kids: { type: String },
    collegeName: { type: String },
    loginStatus: { type: Number, default: 0 },
    zodiac: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zodiac'
    },
    provider: { type: String, enum: ['google', 'facebook', 'local'], default: 'local' },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    status: { type: Boolean, default: true },
    sexualOrientation: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SexualOrientation'
    }],
    interest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest'
    }],
    stausCatogry: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StatusCategories'
    }],
    privacySettings: {
        hideEmail: { type: Boolean, default: false },
        hidePhoneNumber: { type: Boolean, default: false },
        hideDob: { type: Boolean, default: false },
        hideAddress: { type: Boolean, default: false },
        hideGender: { type: Boolean, default: false },
        hidesexualOrientation: { type: Boolean, default: false },
    },
    isPrivate: { type: Boolean, default: false },
    lookingFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LookingFor'
    }],
    language: [{ type: String }],
    distance: { type: Number },
    height: { type: Number },
    meetingFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MeetingFor'
    }],
    media: [{ type: String }],
    profilePic: { type: String },
    address: { type: String },
    covid: { type: Number },
    gender: { type: String, },
    dob: { type: String },
    education: { type: String },
    company: { type: String },
    profession: { type: String },
    salary: { type: Number },
    relationShip: { type: String },
    refreshToken: { type: String },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            default: [0, 0]  // This allows the location to be null if not provided
        }
    },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    about: { type: String },
    socialAcc: [
        {
            name: { type: String, required: true },
            value: { type: String, required: true },
        }
    ]
}, { timestamps: true });


userSchema.virtual('covidName').get(function (this: IUser) {
    return mapToName('covid', this.covid);
});

// userSchema.index({ location: '2dsphere' });
userSchema.set('toJSON', { virtuals: true });
export default mongoose.model<IUser>("User", userSchema);
