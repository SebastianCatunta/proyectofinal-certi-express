import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./data/mongoConnection.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

await connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});