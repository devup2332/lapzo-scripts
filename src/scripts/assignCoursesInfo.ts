import { knexClient } from "../knex";
import { ICourse } from "../models/courseDTO";

export const ASSING_COURSES_INFO = async (subdomain: string) => {
  const topics = [
    {
      "09b216fb-3b55-4032-a0d3-d51a6975b008": [
        "3a2c1ccb-d4f4-4ad0-85b4-604a2532b4dd",
        "d85b0613-9cb4-4efe-ac02-4b2010902204",
      ],
    },
  ];

  const client = await knexClient
    .select("id")
    .from("clients")
    .where("subdomain", subdomain)
    .first();

  const courses: ICourse[] = await knexClient
    .from("courses")
    .select("id")
    .where("clinet_id", client.id);
  console.log({ courses });
};
