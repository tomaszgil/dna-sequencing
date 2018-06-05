const fs = require('fs');
const Data = require('./utils/Data');
const GeneticSolver = require('./genetic/GeneticSolver');
const now = require('performance-now');


const gs = new GeneticSolver({
    populationSize: 1000,
    maxGeneration: 1000,
    mutationRate: 0.03,
    fitnessGrowth: 3,
    burningTime: .7
});

const test = () => {
  let content = 'Instance;Fault Number;Optimum;Result;Precision;Execution Time\n';

  fs.readdirSync('data').forEach(file => {
    const data = new Data(`data/${file}`);
    const t0 = now();
    const result = gs.solve(data);
    const t1 = now();

    content += `${file};${data.faultNum};${data.optimum};${result};${result/data.optimum};${((t1 - t0) / 1000).toFixed(3)}\n`;
    console.log(`${file} with fault ${data.faultNum} and ${data.optimum} optimum => ${result} which is ${result/data.optimum}`);
  });

  fs.writeFileSync('output.csv', content, 'utf8');
};

test();
