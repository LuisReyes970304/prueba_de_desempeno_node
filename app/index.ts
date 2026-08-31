import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import sequelize from "./src/config/database.ts";
import { options } from "./src/doc/swagger.ts";
import { host, port } from "./src/config/database.ts";
import authRouter from "./src/routes/auth.routes.ts";
import userRouter from "./src/routes/user.routes.ts";
import clinicRouter from "./src/routes/clinic.routes.ts";
import warehouseRouter from "./src/routes/warehouse.routes.ts";
import inventoryRouter from "./src/routes/inventory.routes.ts";
import medicationRouter from "./src/routes/medication.routes.ts";
import seedRouter from "./src/routes/seed.routes.ts";
import supplyRequestRouter from "./src/routes/supply-request.routes.ts";
import path from "path";

const openapiSpecification = swaggerJsdoc(options);

await sequelize.authenticate();
await sequelize.sync();

const app = express();

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/clinic", clinicRouter);
app.use("/warehouse", warehouseRouter);
app.use("/inventory", inventoryRouter);
app.use("/medication", medicationRouter);
app.use("/seed", seedRouter);
app.use("/requests", supplyRequestRouter);

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
  const isMulterError = err instanceof Error && err.name === "MulterError";
  const status = isMulterError
    ? 400
    : err && typeof err === "object" && "status" in err && typeof (err as { status: unknown }).status === "number"
      ? (err as { status: number }).status
      : 500;
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
  console.log(`Docs available at ${host}:${port}/docs`);
});
