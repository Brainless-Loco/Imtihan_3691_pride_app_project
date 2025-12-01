import express from "express";
import cors from "cors";
import "./db.js";
import profile from "./routes/profile.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use("/api/profile", profile);
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

app.listen(5000, ()=> console.log("Server running on port 5000"));
