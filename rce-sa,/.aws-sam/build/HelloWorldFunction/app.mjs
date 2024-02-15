/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

// import fs from "fs"
// export const lambdaHandler = async (event, context) => {
//     try {
//         const tmpDir = '/tmp';
        
//         // Log the contents of the /tmp directory
//         console.log('Contents of /tmp directory:', fs.readdirSync(tmpDir));
        
//         return {
//             'statusCode': 200,
//             'body': JSON.stringify({
//                 message: 'hello world',
//             })
//         }
//     } catch (err) {
//         console.log(err);
//         return err;
//     }
// };

import childprocess from "child_process";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import run from "./utils/command.mjs";

export const lambdaHandler = async (event, context) => {
  try {
    let fileName = uuidv4();
    const inputValuesFile = uuidv4();
    const outputFileName = fileName;
    const outputPath = `${outputFileName}`;

    let codeLang = "js",
      code= "console.log(\"helolo\")",
      inputValues = "1";

    const codePath = `/tmp/${fileName}.${codeLang}`;
    const inputPath = `/tmp/${inputValuesFile}.txt`;
    fs.writeFileSync(inputPath, inputValues);
    fs.writeFileSync(codePath, code);

    let result = run(codeLang, fileName, inputValuesFile) || "run";
    console.log("result", result);

    return new Promise((resolve, reject) => {
      childprocess.exec(result, (error, stdout, stderr) => {
        if (error) {
          reject({
            statusCode: 400,
            body: JSON.stringify({
              message: error,
            }),
          });
        } else if (stderr) {
          reject({
            statusCode: 400,
            body: JSON.stringify({
              message: stderr,
            }),
          });
        }

        console.log("output-> ",stdout);
        const a = fs.readFileSync(`/tmp/${fileName}.txt`);
        const output = a.toString().trim();
        console.log(output+"   s")
        resolve({
          statusCode: 200,
          body: JSON.stringify({
            message: JSON.stringify(output),
          }),
        });
      });
    });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
