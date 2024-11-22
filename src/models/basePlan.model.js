import mongoose, {Schema} from "mongoose";

const basePlanSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
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
    },
    {timestamps: true}
);

export const BasePlan = mongoose.model("BasePlan", basePlanSchema);
