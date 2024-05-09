import dotenv from "dotenv";
import { consoleColor } from "./utils/console";

const IS_DEV = process.env.NODE_ENV !== "production";
dotenv.config({ path: IS_DEV ? ".env.development" : ".env.production" });
consoleColor(`\n===> ENVIROMENT: ${process.env.NODE_ENV}`, "yellow");

export const environments = {
  // LMS Connection
  DB_HOST_LMS: process.env.DB_HOST_LMS || "localhost",
  DB_PORT_LMS: Number(process.env.DB_PORT_LMS) || 5432,
  DB_USER_LMS: process.env.DB_USER_LMS || "postgres",
  DB_PASSWORD_LMS: process.env.DB_PASSWORD_LMS || "secret",
  DB_DATABASE_LMS: process.env.DB_DATABASE_LMS || "postgres",

  // Voldemort Connection
  DB_HOST_VDM: process.env.DB_HOST_VDM || "localhost",
  DB_PORT_VDM: Number(process.env.DB_PORT_VDM) || 5432,
  DB_USER_VDM: process.env.DB_USER_VDM || "postgres",
  DB_PASSWORD_VDM: process.env.DB_PASSWORD_VDM || "secret",
  DB_DATABASE_VDM: process.env.DB_DATABASE_VDM || "postgres",

  // Voldemort Backend
  BACKEND_VOLDEMORT_URL:
    process.env.BACKEND_VOLDEMORT_URL || "http://localhost:5001",

  TOKEN_VOLDEMORT: process.env.TOKEN_VOLDEMORT || "secret",
};

console.log({ environments });
