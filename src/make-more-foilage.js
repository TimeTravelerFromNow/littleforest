// example script to generate data
// wont be called in the app
function generateRandomTrees(startIndex, count, bounds = {
  xMin: -4000,
  xMax: 4000,
  yMin: -1000,
  yMax: 1000
}) {
  const trees = [];

  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * (bounds.xMax - bounds.xMin + 1)) + bounds.xMin;
    const y = Math.floor(Math.random() * (bounds.yMax - bounds.yMin + 1)) + bounds.yMin;

    trees.push({
      id: startIndex + i,
      position: [x, y],
      visible: true
    });
  }

  return trees;
}

// Usage example:
const newTrees = generateRandomTrees(40, 30); // Generates 30 trees starting from ID 40
console.log(JSON.stringify(newTrees, null, 2));
