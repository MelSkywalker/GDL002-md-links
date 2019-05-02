const validUrl = require('valid-url');
const request = require('request');

let okLinks = 0;
let failLinks = 0;
let totalLinks = 0;

const validateLink = (link) => {
    if(validUrl.isUri(link)) {
        console.log('ok');
    }
    else {
        console.log('fail');
    }
};

const getStatusCode = (link) => {
    request(link), function(error, response, body){
        console.error('error: ', error);
        console.log(response.getStatusCode);
        console.log('body: ', body);
    }
};

const linksCount = (link) => {
    if(validUrl.isUri(link === false)) {
        return ++failLinks;
    }
};


module.exports = {
    validateLink: validateLink,
    getStatusCode: getStatusCode,
    linksCount: linksCount
  };