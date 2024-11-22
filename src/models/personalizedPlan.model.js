import mongoose, { Schema } from "mongoose";

const personalizedPlanSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        diet: [
            {
                meal: {
                    type: String,
                    required: true,
                },
                time: {
                    type: String,
                },
            },
        ],
        exercises: [
            {
                exercise: {
                    type: String,
                    required: true,
                },
                reps: {
                    type: Number,
                },
            },
        ],
        status: {
            type: String,
            default: "Pending",
        },
    },
    { timestamps: true }
);

export const PersonalizedPlan = mongoose.model(
    "PersonalizedPlan",
    personalizedPlanSchema
);
