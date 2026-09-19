import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import itemsRouter from "./routes/items.js";
import authRoutes from "./routes/authRoutes.js";
import ClaimRoutes from "./routes/claims.js";
import cors from "cors";
// import claimsRouter from './routes/claims.js';
const app = express();
mongoose
  .connect(
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/lpu-lost-found",
  )
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  });
const port = Number(process.env.PORT ?? 4000);
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
  }),
);
// app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());
app.get("/api/health", (_request, response) => response.json({ ok: true }));
app.use("/api/items", itemsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/claim", ClaimRoutes);
// app.use('/api/claims', claimsRouter);
const errorHandler = (err, _req, res, _next) => {
  res.json({
    status: err.status || 404,
    message: err.message || "something went wrong",
  });
};
app.use(errorHandler);
app.listen(port, () => console.log(`API listening on port ${port}`));
//# sourceMappingURL=server.js.map
