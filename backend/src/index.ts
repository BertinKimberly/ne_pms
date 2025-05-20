// index.ts
import "reflect-metadata";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import errorMiddleware from "./middlewares/error.middleware";
import { startScheduledJobs } from "./utils/scheduler";
import router from "./routers";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";

const prisma = new PrismaClient();
const app = express();

// Middlewares
app.use(
   cors({
      origin: "http://localhost:3000",
      credentials: true,
   })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", router);

//swagger doc

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check
app.get("/health", (_req, res) => {
   res.status(200).json({ status: "OK" });
});

// Error handling
app.use(
   (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
   ) => {
      errorMiddleware(err, req, res, next);
   }
);

// Database connection and server start
const PORT = process.env.PORT || 8080;

const startServer = async () => {
   try {
      await prisma.$connect();
      console.log("Database connected");

      // Start scheduled jobs
      startScheduledJobs();

      app.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
      });
   } catch (error) {
      console.error("Database connection error", error);
      process.exit(1);
   }
};
startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
   await prisma.$disconnect();
   process.exit(0);
});

process.on("SIGINT", async () => {
   await prisma.$disconnect();
   process.exit(0);
});
