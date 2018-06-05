const Data = require('./utils/Data');
const GeneticSolver = require('./genetic/GeneticSolver');

const data = new Data('data/18.200-80.txt');
const gs = new GeneticSolver({
    populationSize: 1000,
    maxGeneration: 1000,
    mutationRate: 0.03,
    fitnessGrowth: 3,
    burningTime: .7
});

gs.solve(data);