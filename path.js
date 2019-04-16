const path = require('path');
const fs = require('fs');
const url = require('url');

// let isFile = fs.lstatSync(pathString).isFile();
const isFile = (filePath) => {
    if(fs.lstatSync(filePath).isFile()){
        return true;
    } else{
        return false;
    }
};

const isMD = (filePath) => {
  if(path.extname(filePath).substr(1)=='md'){
    return true;
  } else {
    return false;
  }
};

let findFiles = (folder) => {
  const fileList = [];
  var files = fs.readdirSync(folder);
  for(let i = 0 ; i < files.length ; i++){
    let fileName = path.join(folder, files[i]);
    let stat = fs.lstatSync(fileName);
    if(stat.isDirectory()){
      fileList = fileList.concat(findFiles(folder));
    } else if (fileName.indexOf('.md')>=0){
      fileList.push(fileName);
    }
  }
  return fileList;
};

let findLinks = (file, callback(err, data)) => {
  const linksList = [];
  const content = fs.readFileSync(file);
  data.array.forEach(element => {
    url.parse()
  });
};

// let findFiles = (folder, pattern = /.*/) => {
//   const filesList = [];
//   fs.readdirSync(folder).map(function(e){
//     let fileName = path.join(folder, e);
//     let fileStat = fs.lstatSync(fileName);
//     if(fileStat.isDirectory()){
//       Array.prototype.push.apply(filesList(fileName, pattern));
//     } else{
//       if(pattern.test(fileName)){
//         filesList.push(fileName);
//       }
//     }
//   });
//   return filesList;
// };

module.exports = {
    isFile: isFile,
    isMD: isMD,
    findFiles: findFiles,
    findLinks: findLinks
  };

