import childProcess from "child_process";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import mongoose from 'mongoose';
import { config } from 'dotenv';
import Job from "./models/Job";

config();

const dbConnectAndRun = async (event, context) => {
  try {
    const mongodbUrl = process.env.MONGODB_URL;
    await mongoose.connect(mongodbUrl, {});
    console.log("DB connection successfully established");

    const codeRunner = async () => {
      const { code, codeLang, inputValues } = event.body;
      const fileName = uuidv4();
      const inputValuesFile = uuidv4();
      const codePath = `/tmp/${fileName}.${codeLang}`;
      const inputPath = `/tmp/${inputValuesFile}.txt`;
      const outputPath = `/tmp/${fileName}.txt`;
      let job;

      try {
        fs.writeFileSync(inputPath, inputValues);
        fs.writeFileSync(codePath, code);

        job = new Job({
          language: codeLang,
          filePath: codePath,
        });
        await job.save();
        const jobID = job._id;


        context.succeed({ success: true, data: { jobID } });

        job.StartedAt = new Date();

        const result = run(codeLang, fileName, inputValuesFile) || "run";

        childProcess.exec(result, async (error, stdout, stderr) => {
          if (error) {
            console.error(error);
            return;
          } else if (stderr) {
            console.error(stderr);
            return;
          }

          const output = fs.readFileSync(outputPath, "utf8").trim();

          job.completedAt = new Date();
          job.status = "Success";
          job.output = output;

          await job.save();

          fs.unlinkSync(codePath);
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      } catch (error) {
        console.error(error);
        if (job) {
          job.completedAt = new Date();
          job.status = "failed";
          job.output = JSON.stringify(error);
          await job.save();
        }
      }
    };

    await codeRunner();
  } catch (error) {
    console.error("DB connection failed:", error);
    throw error; // This will cause Lambda to retry the invocation
  }
};

export { dbConnectAndRun };
