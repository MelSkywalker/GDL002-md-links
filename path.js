const fs = require('fs');
const path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');

var argument = process.argv[2];

const isFile = (filePath) => {
    if(fs.lstatSync(filePath).isFile()){
        console.log('isFile true');
        return true;
        
    } else{
        console.log('isFile false');
        return false;
    }
};

const isMD = (filePath) => {
  if(path.extname(filePath).substr(1)=='md'){
    console.log('isMD true');
    return true;
  } else {
    console.log('isMD false');
    return false;
  }
};

let findLinks = (filePath) => {
  const linksList = [];
  let content = fs.readFileSync(filePath).toString();
  let links = markdownLinkExtractor(content);
  links.forEach(function(link){
    linksList.push(link)
    // console.log(links);
  });
  console.log(linksList)
  return linksList;
};

const isDir = (filePath) => {
    const directory = fs.statSync(filePath);
    if(directory.isDirectory()){
        console.log('It is a directory');
        return true;
    }
    else {
        console.log('Not a directory either');
        return false;
    }
}

let findFiles = (filePath) => {
  const fileList = [];

  if(fs.statSync(filePath).isDirectory()){
      let files = fs.readdirSync(filePath);
      //let fPath = filePath;
      for(let i = 0 ; i < files.length ; i++) {
          let newFilePath = filePath + '/' + files[i];
          let stat = fs.lstatSync(newFilePath);
          if(stat.isDirectory()){
            fileList = fileList.concat(findFiles(filePath));
          }
          else if (isFile(newFilePath) && isMD(newFilePath)){
            fileList.push(newFilePath);
          }
      }
  }
  console.log(fileList)
  return fileList;
};


findFiles(argument);

const main = (filePath) => {
    if(isFile(filePath) && isMD(filePath)) {
        const file = fs.readFileSync(filePath);
        //const fileToString = file.toString();
        //console.log(fileToString);
        findLinks(filePath)
    }
    else {
      findFiles(filePath);
    }
}

//main(argument);


// var number = parseInt(process.argv[2]);
// const calc = (n) => {
//     console.log(n*n);
// }
// calc(number);

// 'use strict';

// const path = require('path');
// const fs = require('fs');
// const markdownLinkExtractor = require('markdown-link-extractor');



// let findFiles = (folder) => {
//   const fileList = [];
//   var files = fs.readdirSync(folder);
//   for(let i = 0 ; i < files.length ; i++){
//     let fileName = path.join(folder, files[i]);
//     let stat = fs.lstatSync(fileName);
//     if(stat.isDirectory()){
//       fileList = fileList.concat(findFiles(folder));
//     } else if (fileName.indexOf('.md')>=0){
//       fileList.push(fileName);
//     }
//   }
//   return fileList;
// };


// module.exports = {
//     isFile: isFile,
//     isMD: isMD,
//     findFiles: findFiles,
//     findLinks: findLinks
//   };

