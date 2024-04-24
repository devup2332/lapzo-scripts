import knex from "knex";
import { environments } from "./environments";

export const knexClient = knex({
  client: "pg",
  connection: {
    host: environments.DB_HOST,
    port: environments.DB_PORT,
    user: environments.DB_USER,
    password: environments.DB_PASSWORD,
    database: environments.DB_DATABASE,
  },
});
