const fs = require('fs');
const path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');
const fetch = require('node-fetch');
const chalk = require('chalk');
const options = require('./options.js');

const argument = process.argv[2];
let option = process.argv[3];

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

let findLinks = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let links = markdownLinkExtractor(content);
  let linkCount = 0;
  links.forEach(function(link) {
    function linkStatus(res) {
      if(res.ok){
        if(!option) {
          return console.log(`${filePath} ${link}`);
        }
        else if(option === '--validate') {
          return  console.log(chalk.green(`${filePath} ${link} ${res.statusText} ${res.status}`));
        }
      }
    }
    fetch(link)
      .then(linkStatus)
      .catch((error) => {
        if(!option) {
          console.log(`${filePath} ${link}`)
        } else {
          console.log(chalk.red(`${filePath} ${link} - Error: ${error.message}`));
        }
      })
  });
};

const isDir = (filePath) => {
    const directory = fs.statSync(filePath);
    if(directory.isDirectory()){
        return true;
    }
    else {
        return false;
    }
}

let findFiles = (filePath) => {
  fs.readdir(filePath, function(err, files) {
    if(err) return console.log(chalk.red(err.message));
    else {
      files.forEach(function(file) {
        let newFilePath = `${filePath}/${file}`;
        let stat = fs.lstatSync(newFilePath, 'utf-8');
        if(isFile(newFilePath) && isMD(newFilePath)) {
          findLinks(newFilePath);
        }
        else if(stat.isDirectory()) {
          console.log('is Dir');
          findFiles(newFilePath);
        }
      });
    }
  })
};

const mainPath = (filePath) => {
  let foundLinks;
    if(isFile(filePath) && isMD(filePath)) {
      findLinks(filePath);
    }
    else {
      foundLinks = findFiles(filePath).forEach(findLinks(filePath));
    }
    // if (option === '--stats') {
    //   console.log(chalk.red('Almost ready'))
    //   console.log('Total: ' + foundLinks.length);
    //   //console.log('Broken: ' + foundLinks.forEach(options.linksCount));
    // }
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