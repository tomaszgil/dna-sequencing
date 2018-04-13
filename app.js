const Data = require('./utils/Data');
const GeneticSolver = require('./genetic/GeneticSolver');

const data = new Data('data/9.200-40.txt');
const gs = new GeneticSolver({
  populationSize: 300,
  maxGeneration: 1000,
  mutationRate: 0.03,
  fitnessGrowth: 1
});

gs.solve(data);