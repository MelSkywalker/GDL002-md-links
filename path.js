'use strict';

const path = require('path');
const fs = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');

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

module.exports = {
    isFile: isFile,
    isMD: isMD,
    findFiles: findFiles,
    findLinks: findLinks
  };

