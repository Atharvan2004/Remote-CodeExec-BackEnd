let result: { extension: any; runCommand: any; compileCommand: any };

const run = (codeLang: string, fileName: string, inputValuesFile: string) => {
  switch (codeLang) {
    case "js":
      return `cd ./temp && node ${fileName}.js < ${inputValuesFile} > ${fileName}.txt`;
    case "java":
      return `cd ./temp && java ${fileName}.java < ${inputValuesFile} > ${fileName}.txt`;
    case "py":
      return `cd ./temp && python3 ${fileName}.py < ${inputValuesFile} > ${fileName}.txt`;
    case "c":
      return `cd ./temp && gcc ${fileName}.c -o ${fileName} && ./${fileName} < ${inputValuesFile} > ${fileName}.txt`;
    case "cpp":
      return `cd ./temp && g++ ${fileName}.cpp -o ${fileName} && ./${fileName} < ${inputValuesFile} > ${fileName}.txt`;
    default:
      const err = new Error(`command not found: ${fileName}`);
      err.name = "CommandError";
      throw err;
  }
};


export default run;