const fs = require('fs');
const path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');
const fetch = require('node-fetch');
const chalk = require('chalk');
const validUrl = require('valid-url');

const r = /\[.*?\]\(http.*?\)/g;
const argument = process.argv[2];
const option = process.argv[3];
const option2 = process.argv[4];

const isFile = (filePath) => {
    if (fs.lstatSync(filePath).isFile()) {
        return true;
    } else {
        return false;
    }
};

const isMD = (filePath) => {
    if (path.extname(filePath)==='.md') {
        return true;
    } else {
        return false;
    }
};

const findLinks = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    let links = markdownLinkExtractor(content);
    if (!option) {
        let foundLinks = content.match(r).toString();
        let formattedLinks = foundLinks.replace(/,/g, "\n")
            .replace(/\[/g, "-")
            .replace(/\(/g, "")
            .replace(/\]/g, ": ")
            .replace(/\)/g, "");
        return console.log(formattedLinks);
    }
    else if (option === '--validate') {
        // let links = markdownLinkExtractor(content);
        links.forEach(function(link) {
            function linkStatus(res) {
                if(res.ok) {
                    return  console.log(chalk.green(`${filePath} ${link} ${res.statusText} ${res.status}`));
                }
            }
            fetch(link)
                .then(linkStatus)
                .catch((error) => {
                    return console.log(chalk.red(`${filePath} ${link} - Error: ${error.message}`));
                })
        })
    }
    else if (option === '--stats') {
        // const links = markdownLinkExtractor(content);
        let uniqueLinks = [...new Set(links)];
        let count = [];
        links.forEach(function (i) {
            count[i] = (count[i] || 0 ) +1;
        });
        return (
            console.log(`Total: ${links.length} \nUnique: ${uniqueLinks.length}`),
            console.log(count)
        );
    }
};

const isDir = (filePath) => {
    const directory = fs.statSync(filePath);
    if(directory.isDirectory()) {
        return true;
    }
    else {
        return false;
    }
};

let findFiles = (filePath) => {
    fs.readdir(filePath, function(err, files) {
        if(err) throw err;
        else {
            files.forEach(function(file) {
                let newFilePath = `${filePath}/${file}`;
                let stat = fs.lstatSync(newFilePath, 'utf-8');
                if(isFile(newFilePath) && isMD(newFilePath)) {
                    findLinks(newFilePath);
                }
                else if (stat.isDirectory()) {
                    findFiles(newFilePath);
                }
            })
        }
    })
};

const mdLinks = (filePath) => {
    if(isFile(filePath) && isMD(filePath)) {
        findLinks(filePath);
    }
    else {
        findFiles(filePath);
    }
};

module.expots = {
    mdLinks,
    isFile,
    isMD,
    findLinks,
    isDir,
    findFiles
}

mdLinks(argument,option);