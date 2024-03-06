import childprocess from "child_process";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import run from "../utils/command";
import Job from "../models/Job";

const codeRunner = async (req: any, res: any) => {
  let fileName = uuidv4();
  const inputValuesFile = uuidv4();

  let { code, codeLang, inputValues } = req.body;

  const codePath = `./temp/${fileName}.${codeLang}`;
  const inputPath = `./temp/${inputValuesFile}.txt`;
  const outputPath = `./temp/${fileName}.txt`;
  let job: any;
  try {
    fs.writeFileSync(inputPath, inputValues);
    fs.writeFileSync(codePath, code);

   job = new Job({
      language: codeLang,
      filePath: codePath,
    });
    await job.save();
    const jobID = job._id;

    console.log(job);

    res.status(201).json({ success: true, data: { jobID: jobID } });

    job.StartedAt = new Date();

    let result = run(codeLang, fileName, inputValuesFile) || "run";

    childprocess.exec(result, async (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ compilation_error: error });
      } else if (stderr) {
        return res.status(500).json({ std_error: stderr });
      }

      const a = fs.readFileSync(`./temp/${fileName}.txt`);
      const output = a.toString().trim();

      job.completedAt = new Date();
      job.status = "Success";
      job.output = output;

      await job.save();
      console.log(job);
      // res.status(200).json({ success: true, data: { output: output } });

      fs.unlinkSync(codePath);
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    job.completedAt = new Date();
    job.status = "failed";
    job.output = JSON.stringify(error);
    await job.save();
   console.log(error);
  }
};

export { codeRunner };
