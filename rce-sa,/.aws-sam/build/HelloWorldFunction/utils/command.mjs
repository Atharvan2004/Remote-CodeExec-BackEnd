const run = (codeLang, fileName, inputValuesFile) => {
  switch (codeLang) {
    case "js":
      return `cd /tmp && node ${fileName}.js < ${inputValuesFile}.txt > ${fileName}.txt`;
    case "java":
      return `cd /tmp && java ${fileName}.java < ${inputValuesFile}.txt > ${fileName}.txt`;
    case "py":
      return `cd /tmp && python3 ${fileName}.py < ${inputValuesFile}.txt > ${fileName}.txt`;
    case "c":
      return `cd /tmp && gcc ${fileName}.c -o ${fileName} && ./${fileName} < ${inputValuesFile}.txt > ${fileName}.txt`;
    case "cpp":
      return `cd /tmp && g++ ${fileName}.cpp -o ${fileName} && ./${fileName} < ${inputValuesFile}.txt > ${fileName}.txt`;
    default:
      const err = new Error(`command not found: ${fileName}`);
      err.name = "CommandError";
      throw err;
  }
};


export default run;