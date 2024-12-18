import { useState } from 'react';
import bgimage from './bg.png';
import Background from './Background.js';
import Tree from './Tree.js';
import Animal from './Animal.js';
import FoundAnimals from './FoundAnimals.js';
import MiniMap from './MiniMap.js';
import treeData from './game-data/trees.json';
import rockData from './game-data/rocks.json';
const math = require('mathjs');

function importAll(r) {
  let images = {};
  r.keys().map(item => { images[item.replace('./', '')] = r(item); });
  return images;
}
const assets = importAll(require.context('./assets', false, /\.png/));

export default function Game() {
  const [allFound, setAllFound] = useState(false);
  const [foundAnimals, setFoundAnimals] = useState({ 'mouse': false, 'white-owl': false, 'rabbit': false });
  const [cullTrees, setCullTrees] = useState(true);

  // view box coordinates
  const viewBox = {
    v0: [ 40, 40],
    v1: [window.innerWidth - 40, window.innerHeight - 40]
  };
  const viewBoxSize = [viewBox.v1[0] - viewBox.v0[0], viewBox.v1[1] - viewBox.v0[1]];
  const origin = [0, 0];

  // `coords` are the current position to render all components from.
  const [coords, setCoords] = useState(origin)

  const mapLimits = {
    v0: [-4000, -1000],
    v1: [4000, 1000]
  };

  const mousePos = [-40,100];
  const owlPos = [-60,200];
  const rabbitPos = [60,-200];
  const [trees, setTrees] = useState(treeData.trees);
  const [rocks, setRocks] = useState(rockData.rocks);

  function withinDrawableArea(pos, newCoords) {
    if(!cullTrees) return true;
    const viewPos = math.subtract(pos, newCoords);

    const withinX = (viewBox.v0[0] < viewPos[0]) && (viewPos[0] < viewBox.v1[0]);
    const withinY = (viewBox.v0[1] < viewPos[1]) && (viewPos[1] < viewBox.v1[1]);

    return withinX && withinY;
  }

  function redrawTreesAndRocks(newCoords) {
    setTrees(trees.map((tree) => ({ id: tree.id, position: tree.position, visible: withinDrawableArea(tree.position, newCoords)})));
    setRocks(rocks.map((rock) => ({ id: rock.id, position: rock.position, visible: withinDrawableArea(rock.position, newCoords)})));
  }

  function setCoordsAndRedraw(newCoords) {
    setCoords(newCoords);
    redrawTreesAndRocks(newCoords);
  }

  function moveCoords(x, y) {
    let newCoords = [...coords];
    if (mapLimits.v0[0] - viewBox.v0[0] > coords[0] + x)
    {
      newCoords[0] = mapLimits.v0[0] - viewBox.v0[0] + 1;
    }
    else if (coords[0] + x > mapLimits.v1[0] - viewBox.v1[0]) {
      newCoords[0] = mapLimits.v1[0] - viewBox.v1[0] - 1;
    } else {
      newCoords[0] += x;
    }
    if (mapLimits.v0[1] - viewBox.v0[1] > coords[1] + y) {
      newCoords[1] = mapLimits.v0[1] - viewBox.v0[1] + 1;
    } else if (coords[1] + y > mapLimits.v1[1] - viewBox.v1[1]) {
      newCoords[1] = mapLimits.v1[1] - viewBox.v1[1] - 1;
    } else {
      newCoords[1] += y;
    }
    setCoords(newCoords);
    redrawTreesAndRocks(newCoords);
  }

  function foundAnimal(animal) {
    setFoundAnimals({ ...foundAnimals, [animal]: true });

    let allFound = true;
    for( const key in foundAnimals) {
      if(!foundAnimals[key] && key !== animal) {
        allFound = false;
      }
    }
    setAllFound(allFound);
  }

  return (
    <>
      <Background bgimage={bgimage} moveCoords={moveCoords} coords={coords} viewBoxSize={viewBoxSize}/>

      {trees.map((tree, index) => (
        tree.visible ? <Tree key={tree.id} id={tree.id} pos={tree.position} coords={coords} assets={assets} fname={"tree"}/> : null
      ))}
      { rocks.map((rock, index) => (
        rock.visible ? <Tree key={rock.id} id={rock.id} pos={rock.position} coords={coords} assets={assets} fname={"rock_"}/> : null
      ))}

      { withinDrawableArea(mousePos, coords) ? <Animal key={'1'} id={0} pos={mousePos} coords={coords} assets={assets} fname={"mouse"} foundAnimal={foundAnimal} />  : null }

      { withinDrawableArea(owlPos, coords) ? <Animal key={'2'} id={0} pos={owlPos} coords={coords} assets={assets} fname={"white-owl"} foundAnimal={foundAnimal} />  : null }

      { withinDrawableArea(rabbitPos, coords) ? <Animal key={'3'} id={0} pos={rabbitPos} coords={coords} assets={assets} fname={"rabbit"} foundAnimal={foundAnimal} />  : null }

      <FoundAnimals foundAnimals={foundAnimals} assets={assets} bgimage={bgimage} allFound={allFound} />

      <MiniMap
      coords={coords}
      setCoordsAndRedraw={setCoordsAndRedraw}
      moveCoords={moveCoords}
      trees={trees}
      mapLimits={mapLimits}
      viewBox={viewBox}
      viewBoxSize={viewBoxSize}
      cullTrees={cullTrees}
      setCullTrees={setCullTrees}
      />


    </>
  );
}
