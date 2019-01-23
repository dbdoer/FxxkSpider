import mongoose from "./conn";

const { Schema } = mongoose;

enum UserRole {
    admin = 1,
    operator,
    user,
}

const ROLE = {
    ADMIN: 1,
    OPERATOR: 2,
    USER: 3,
};

interface IUser extends mongoose.Document {
    username: string;
    password: string;
    role: UserRole[];
    salt: string;
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    role: {
        type: [Number],
        required: true,
        default: 3,
    },
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export {
    User,
    IUser,
    ROLE,
};
