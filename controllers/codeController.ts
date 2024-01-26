import childprocess from "child_process";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import run from '../utils/command'


const codeRunner = async (req: any, res: any) => {

 try{

  let fileName = uuidv4();
  const inputValuesFile = fileName;
  const outputFileName = fileName;
  const outputPath = `${outputFileName}`;

  let { code, codeLang,inputValues } = req.body;

  const codePath = `./temp/${fileName}.${codeLang}`;
  const inputPath = `./temp/${inputValuesFile}`
  fs.writeFileSync(inputPath, inputValues);
  fs.writeFileSync(codePath, code);

  let result =run(codeLang,fileName,inputValuesFile) || "run";
  console.log('result',result)
    
    childprocess.exec(result, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({compilation_error:error});      
      } else if(stderr){
        return res.status(500).json({std_error:stderr});
      }
      
      // console.log("output-> ",stdout);
      const a = fs.readFileSync(`./temp/${fileName}.txt`)
      const output = a.toString().trim()
      res.status(200).json({message: '', data: {output:output}}
      )})
      
    // fs.unlinkSync(codePath) not working if uncommented
    // fs.unlinkSync(inputPath) not working if uncommented
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", err: error });
  } 
};

export { codeRunner };
