import { environments } from "../environments";
import { knexClientVDM } from "../knex";
import { IClient } from "../models/client";
import { ICourse } from "../models/course";
import { ICoursesPrivacy } from "../models/coursesPrivacy";
import { consoleColor } from "../utils/console";
import axios from "axios";
import { sleep } from "../utils/sleep";
import xlsx from "xlsx";

export const MASSIVE_COURSE_MP_COURSES_CONFIGURATION = async (
  subdomain: string
) => {
  consoleColor(`===> FETCHING INITIAL INFO`, "yellow");

  const client: IClient = await knexClientVDM
    .from("clients")
    .select("id")
    .where("subdomain", subdomain)
    .first();
  if (!client) {
    return consoleColor(`===> CLIENT NOT FOUND -- END`, "red");
  }

  consoleColor(`===> FETCHING COURSES`, "yellow");

  const coursesUrl = `${environments.BACKEND_VOLDEMORT_URL}/catalog/courses/${client.id}`;

  const { data } = await axios.get(coursesUrl, {
    headers: {
      Authorization: `Bearer ${environments.TOKEN_VOLDEMORT}`,
    },
  });
  const coursesCatalog: ICourse[] = data.data.courses;

  consoleColor(`===> FETCHING COURSES PRIVACY`, "yellow");

  const coursesInfoToCompare: ICoursesPrivacy[] = await knexClientVDM
    .select("*")
    .from("lms_courses_privacy")
    .where("client_id", client.id);

  const publicCourses = coursesCatalog
    .filter((c) => {
      const courseInfo = coursesInfoToCompare.find(
        (cic) => cic.course_id === c.id
      );
      if (!courseInfo) return false;
      return courseInfo.privacy === "PUBLIC";
    })
    .slice(0, 20);

  const ids = publicCourses.map((c) => c.id);
  const providers = publicCourses.map((c) => c.provider?.id);

  consoleColor(`===> COURSES TO PUBLISH ${ids.length}`, "yellow");

  const splitNumber = 100;
  const steps = Math.ceil(ids.length / splitNumber);

  const totalPublished = [];
  const totalInProgress = [];

  for (let i = 0; i < steps; i++) {
    consoleColor(
      `===> GETTING TOPICS - SUBTOPICS - COMPETENCES - COURSES INFO ${
        i + 1
      }/${steps}`,
      "yellow"
    );
    const start = splitNumber * i;
    const end = splitNumber * (i + 1);
    const params = new URLSearchParams({
      courses: ids.slice(start, end).join(","),
      providers: providers.slice(start, end).join(","),
    }).toString();
    const topicsUrl = `${environments.BACKEND_VOLDEMORT_URL}/catalog/publication/topics-competences?${params}`;
    const {
      data: {
        data: { topics, subtopics, competences, courses },
      },
    } = await axios.get(topicsUrl, {
      headers: {
        Authorization: `Bearer ${environments.TOKEN_VOLDEMORT}`,
      },
    });
    const basicPublicationUrl = `${environments.BACKEND_VOLDEMORT_URL}/catalog/publication/basic/${client.id}`;

    const {
      data: {
        data: { in_progress, published },
      },
    } = await axios.post(
      basicPublicationUrl,
      {
        competences,
        courses,
        subtopics,
        topics,
      },
      {
        headers: {
          Authorization: `Bearer ${environments.TOKEN_VOLDEMORT}`,
        },
      }
    );
    consoleColor(`===> PUBLISHED ${published?.length || 0}`, "green");
    consoleColor(`===> IN PROGRESS ${in_progress?.length || 0}`, "blue");
    totalInProgress.push(...in_progress);
    totalPublished.push(...published);
    await sleep(1000);
  }
  consoleColor(`===> WRITING EXCEL`, "yellow");
  const wb = xlsx.utils.book_new();
  const inProgressSheet = xlsx.utils.json_to_sheet(totalInProgress);
  const publishedSheed = xlsx.utils.json_to_sheet(totalPublished);

  xlsx.utils.book_append_sheet(wb, inProgressSheet, "In Progress");
  xlsx.utils.book_append_sheet(wb, publishedSheed, "Published");
  xlsx.writeFile(wb, `Result.xlsx`);

  consoleColor(`===> FINISHED`, "green");
};
