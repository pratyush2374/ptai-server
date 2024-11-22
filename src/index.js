import dotenv from "dotenv";
import connectDB from "../db/index.js";

dotenv.config({path: "./.env"});
import {app} from "./app.js";

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error occured with loading app ", error);
        });
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server listening at port ${port}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed", error);
    });