const cp=require('child_process');
const fs=require('fs');

exports.calculateCode=async(req, res) => {
  const {code, inputValues}=req.body;

  // fs.writeFile(temp.cpp,${code},()=>{
  //   cp.exec(g++ temp.cpp -o temp, (error, stdout, stderr) => {
  //     if (error) {
  //       return res.status(500).json({compilation_error:error});      
  //     } else if(stderr){
  //       return res.status(500).json({std_error:stderr});
  //     } else{ 
  //       const chidlProcess=cp.spawn(.\\temp, [], {
  //         stdio:['pipe','pipe','pipe']
  //       });
  
  //       chidlProcess.stdin.write(inputValues);
  //       chidlProcess.stdin.end();
  
  //       let output;
  //       chidlProcess.stdout.on('data', (data)=>{
  //         output=data.toString();
         
  //       });
  
  //       chidlProcess.on('error', (errors)=>{
  //         return res.status(500).json({execution_error:errors});
  //       })
  
  //       chidlProcess.on('exit', (code,signal) => {
  //        if(code) return res.status(500).json({ code:code, message:Exited with code ${code}});
  //        if(signal) return res.status(500).json({ signal:signal, message:Process killed with signal ${signal}});
          
         
  //        fs.unlink(temp.cpp,()=>{});
  //        fs.unlink(temp.exe,()=>{});
  
  //        console.log("code executed successfully ✅")
  //        return res.status(200).json({
  //         data:output
  //       })
  //       });
  
  //     }
  //   });
  // })

  fs.writeFile(temp.py,`${code}`,()=>{

    const chidlProcess = cp.spawn('python', ['temp.py'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    inputValues.split(' ').forEach(value => {
      chidlProcess.stdin.write(value + '\n');
    });
    chidlProcess.stdin.end();

    let output;
    chidlProcess.stdout.on('data', (data)=>{
      output=data.toString();
      
    });

    chidlProcess.on('error', (errors)=>{
      return res.status(500).json({execution_error:errors});
    })

    chidlProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
    });

    chidlProcess.on('exit', (code,signal) => {
      if(code) return res.status(500).json({ code:code, message:`Exited with code ${code}`});
      if(signal) return res.status(500).json({ signal:signal, message:`Process killed with signal ${signal}`});
      
      
      // fs.unlink(temp.cpp,()=>{});
      // fs.unlink(temp.exe,()=>{});

      console.log("code executed successfully ✅")
      return res.status(200).json({
      data:output
    })
    });  
      
  })

};