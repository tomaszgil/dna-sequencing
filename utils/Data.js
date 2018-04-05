const fs = require('fs');
const WordPair = require('./WordPair');

const getFileName = (path) => {
  const splitted = path.split("/");
  return splitted[splitted.length - 1];
};

class Data {
  constructor(path) {
    this.fileName = getFileName(path);
    this.words = Data.getWords(path);
    this.pairs = this.getPairs();

    const instanceAttr = Data.getInstanceAttr(this.fileName, this.words[0]);
    this.sequenceLength = instanceAttr.n;
    this.wordLength = instanceAttr.l;
    this.faultNum = instanceAttr.faultNum;
  }

  static getWords(path) {
    return fs.readFileSync(path, 'utf-8')
      .split('\n')
      .filter(Boolean)
      .map(word => word.trim());
  };

  static getInstanceAttr(fileName, exampleWord) {
    const info = fileName.split(/[-\.\+]/);
    const faultType = fileName.includes('+') ? 1 : -1;
    const l = exampleWord.length;
    const n = parseInt(info[1]) + l - 1;
    const faultNum = parseInt(info[2]) * faultType;

    return { n, l, faultNum }
  };

  getPairs() {
    let pairs = [];

    for (let i = 0; i < this.words.length; i++) {
      for (let j = 0; j < this.words.length; j++) {
        pairs.push(new WordPair(i, j, this.words[i], this.words[j]));
      }
    }

    return pairs;
  }
}

module.exports = Data;