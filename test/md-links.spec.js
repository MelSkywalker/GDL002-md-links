const mdLinks = require('../');
const path = require('../path.js');

describe('isFile', () => {
  it('should return true', () => {
    expect(path.isFile('index.js')).toBe(true);
  });
  it('should return false', () => {
    expect(path.isFile('test')).toBe(false);
  });
});
describe('isMD', () => {
  it('should return true', () => {
    expect(path.isMD('README.md')).toBe(true);
  });
  it('should return false', () => {
    expect(path.isMD('index.js')).toBe(false);
  });
});
describe('findFiles', () => {
  it('should return an array', () => {
    expect(typeof path.findFiles('test', pattern = /.md/)).toBe('object')
  });
});
describe('findLinks', () => {
  it('should return 2', () => {
    expect(path.findLinks('test.md').length).toBe(4);
  })
})


describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });

});
