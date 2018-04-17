const Data = require('./utils/Data');
const GeneticSolver = require('./genetic/GeneticSolver');

const data = new Data('data/9.200-40.txt');
const gs = new GeneticSolver({
  populationSize: 500,
  maxGeneration: 2000,
  mutationRate: 0.05,
  fitnessGrowth: 3
});

gs.solve(data);
