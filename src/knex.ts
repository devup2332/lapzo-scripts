import knex from "knex";
import { environments } from "./environments";

export const knexClientLMS = knex({
  client: "pg",
  connection: {
    host: environments.DB_HOST_LMS,
    port: environments.DB_PORT_LMS,
    user: environments.DB_USER_LMS,
    password: environments.DB_PASSWORD_LMS,
    database: environments.DB_DATABASE_LMS,
  },
});
export const knexClientVDM = knex({
  client: "pg",
  connection: {
    host: environments.DB_HOST_VDM,
    port: environments.DB_PORT_VDM,
    user: environments.DB_USER_VDM,
    password: environments.DB_PASSWORD_VDM,
    database: environments.DB_DATABASE_VDM,
  },
});
