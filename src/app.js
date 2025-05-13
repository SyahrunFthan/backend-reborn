import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Configuration
import db from "./configs/Database.js";
// import createModel from "./models/ModelUsers.js";

// Router API
import RouteStallCategories from "./routers/RouteStallCategories.js";
import RouteAuth from "./routers/RouteAuth.js";

dotenv.config();

const app = express();

try {
  await db.authenticate();
  console.log("Database connected");
  // createModel.sync({ alter: true });
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173/" }));
app.use(cookieParser());
app.use(fileUpload());
app.use("/public", express.static("public"));

// End Point API
app.use("/stall-categories", RouteStallCategories);
app.use("/auth", RouteAuth);

app.listen(5001, () => {
  console.log("Server running at port 5001....");
});
