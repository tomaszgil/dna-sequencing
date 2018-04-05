const Data = require('./utils/Data');
const GeneticSolver = require('./genetic/GeneticSolver');

const data = new Data('data/9.200-40.txt');
const gs = new GeneticSolver({
  populationSize: 100,
  maxGeneration: 500,
  mutationRate: 0.03,
  fitnessGrowth: 2
});

gs.solve(data);