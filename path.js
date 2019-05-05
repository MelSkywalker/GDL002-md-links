const fs = require('fs');
const path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');
const fetch = require('node-fetch');
const chalk = require('chalk');
const options = require('./options.js');

const argument = process.argv[2];
let option = process.argv[3];
const fileList = [];

const isFile = (filePath) => {
    if(fs.lstatSync(filePath).isFile()){
        //console.log('isFile true');
        return true;
    } else{
        //console.log('isFile false');
        return false;
    }
};

const isMD = (filePath) => {
  if(path.extname(filePath).substr(1)=='md'){
    //console.log('isMD true');
    return true;
  } else {
    //console.log('isMD false');
    return false;
  }
};

let findLinks = (filePath) => {
  const linksList = [];
  let content = fs.readFileSync(filePath, 'utf-8');
  let links = markdownLinkExtractor(content);
  links.forEach(function(link) {
    function linkStatus(res) {
      if(res.ok){
        return  console.log(chalk.green(`${filePath} ${link} ${res.statusText} ${res.status}`));
      }
      // else {
      //   return console.log(`${filePath} ${link} fail ${res.statusText} ${res.status}`)
      // }
    }
    // ->linksList.push(link)
    // console.log(links);
    fetch(link)
      .then(linkStatus)
      .catch((error) => {
        console.log(chalk.red(`${filePath} ${link} - Error: ${error.message}`));
      })
  });
  //console.log(linksList)
  //return linksList;
};

const isDir = (filePath) => {
    const directory = fs.statSync(filePath);
    if(directory.isDirectory()){
        //console.log('It is a directory');
        return true;
    }
    else {
        //console.log('Not a directory either');
        return false;
    }
}

let findFiles = (filePath) => {
  //const fileList = [];

  // if(fs.statSync(filePath).isDirectory()){
      let files = fs.readdirSync(filePath, 'utf-8');
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
  // }
  //console.log(fileList)
  return fileList;
};

const mainPath = (filePath) => {
  let foundLinks;
    if(isFile(filePath) && isMD(filePath)) {
        //const file = fs.readFileSync(filePath);
        //const fileToString = file.toString();
        //console.log(fileToString);
        foundLinks = findLinks(filePath);
    }
    else {
      foundLinks = findFiles(filePath).forEach(findLinks(filePath));
    }
    if (option === 'validate') {
      console.log(chalk.red('Not ready .-.'));

      foundLinks.forEach(options.validateLink, options.getStatusCode);
    }
    if (option === 'stats') {
      console.log(chalk.red('Almost ready'))
      console.log('Total: ' + foundLinks.length);
      //console.log('Broken: ' + foundLinks.forEach(options.linksCount));
    }
    // else {
    //   console.log(chalk.red('Almost ready'));
    //   console.log(foundLinks);
    // }
};


module.exports = {
    isFile: isFile,
    isMD: isMD,
    findLinks: findLinks,
    isDir: isDir,
    findFiles: findFiles,
    mainPath: mainPath
  };

mainPath(argument, option);


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
