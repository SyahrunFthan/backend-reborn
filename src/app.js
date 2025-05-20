import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

// Configuration
import db from "./configs/Database.js";
// import createModel from "./models/ModelStalls.js";

// Router API
import RouteStallCategories from "./routers/RouteStallCategories.js";
import RouteAuth from "./routers/RouteAuth.js";
import RouteIncomingMails from "./routers/RouteIncomingMails.js";
import { readFile } from "fs/promises";
const apiDocs = JSON.parse(
  await readFile(new URL("../api-docs.json", import.meta.url))
);

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs));

// End Point API
app.use("/stall-categories", RouteStallCategories);
app.use("/auth", RouteAuth);
app.use("/incoming-mails", RouteIncomingMails);

app.listen(5001, () => {
  console.log("Server running at port 5001....");
});
