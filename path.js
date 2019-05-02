'use strict';

const path = require('path');
const fs = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');
const validUrl = require('valid-url');
const request = require('request');

// const todo = (filePath) => {
//   if(isFile(filePath)) {
//     if(isMD(filePath)) {
//       return console.log(findLinks(file));
//     }
//     else {
//       return console.log('Not a markdown File');
//     }
//   }
//   else {
//     console.log(findFiles(filePath))
//   }
// }

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

let findLinks = (file) => {
  const linksList = [];
  let content = fs.readFileSync(file).toString();
  let links = markdownLinkExtractor(content);
  links.forEach(function(link){
    linksList.push(links)
    // console.log(links);
  });
  return linksList;
};

const validateLink = (link) => {
  let urlWorking;
  if (validUrl.isUri(link)){
    urlWorking = "ok";
  } else {
    urlWorking = "fail";
  }
};
const getStatusCode = (link) => {
  request(link), function(error, response, body){
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
  }
};

const stats = () => {

};

module.exports = {
    isFile: isFile,
    isMD: isMD,
    findFiles: findFiles,
    findLinks: findLinks
  };

  // const melDLink = require('melDLink');

  // melDLink('test.md', { validate: true }).then(result => {
  //   console.log(result);
  // });

  // fetch('google.com')
  // .then(result => console.log(result))
  // .catch(error => {
  //   console.error(error);
  // })

  // module.exports = {
  //   melDLink: (file, options) => {
  //     return new Promise((resolve, reject) => {
  //       //read File
  //       somethingAsync('test.md', (error, result) => {
  //         if (error) {
  //           reject(error);
  //           return;
  //         }
  //         resolve(result);
  //       })
  //     });
  //   }
  // }
  // new Promise(resolve)