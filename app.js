import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";


dotenv.config();


connectDB();

const app = express();


if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(cors());

app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 5000;

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});