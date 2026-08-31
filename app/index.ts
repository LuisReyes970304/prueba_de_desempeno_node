import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import sequelize from "./src/config/database.ts";
import { options } from "./src/doc/swagger.ts";
import { host, port } from "./src/config/database.ts";
import authRouter from "./src/routes/auth.routes.ts";
import userRouter from "./src/routes/user.routes.ts";

const openapiSpecification = swaggerJsdoc(options);

await sequelize.authenticate();
await sequelize.sync();

const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);

/**
 * Any unexisty route will be respond in Json
 */
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

/**
 * Global error management. it always respond with a Json instead of a HTML
 */
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const message = err instanceof Error ? err.message : "Internal server error";
  const status =
    err && typeof err === "object" && "status" in err && typeof (err as { status: unknown }).status === "number"
      ? (err as { status: number }).status
      : 500;
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
  console.log(`Docs available at ${host}:${port}/docs`);
});
