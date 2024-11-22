import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        avatar : {
            type: String,
            required: true,
        },
        goal: {
            type: String,
            required: true,
            trim: true,
        },
        preferences: {
            diet: {
                type: [String],
                default: [],
            },
            exercises: {
                type: [String],
                default: [],
            },
        },
        logs: {
            meals: [
                {
                    date: {type: Date, required: true},
                    details: {type: String, trim: true},
                },
            ],
            exercises: [
                {
                    date: {type: Date, required: true},
                    details: {type: String, trim: true},
                },
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        refreshToken: {
            type: String,
        },
    },
    {timestamps: true}
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            goal: this.goal,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {_id: this._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
};

export const User = mongoose.model("User", userSchema);
