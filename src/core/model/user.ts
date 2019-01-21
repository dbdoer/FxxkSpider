import mongoose from "./conn";

const { Schema } = mongoose;

enum UserRole {
    admin = 1,
    operator,
    user,
}

interface IUser extends mongoose.Document {
    username: string;
    password: string;
    role: UserRole;
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
    role: {
        type: [Number],
    },
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export {
    User,
    IUser,
};
