import dotenv from "dotenv";
dotenv.config();
export const environments = {
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "secret",
  DB_DATABASE: process.env.DB_DATABASE || "postgres",
};
