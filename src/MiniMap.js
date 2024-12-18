// Minimap
// Everything gets converted to percentages.
import { useRef } from 'react';
const math = require('mathjs');

function Element({mapBox, position, isDrawable}) {
  const x = 100 * (position[0] ) / mapBox[0] + 50;
  const y = 100 * (position[1] ) / mapBox[1] + 50;
    return <div className="minimap__element"
    style={{'--x': x + '%',
       '--y': y + '%' }}>
                <div className="dot" style={{'backgroundColor': isDrawable ? 'white' : 'green'}}></div>


       </div>
}

function ViewBox({viewBox, viewBoxSize, mapBox, coords}) {
  const x = 100 * (coords[0] + viewBox.v0[0] ) / mapBox[0] + 50;
  const y = 100 * (coords[1] + viewBox.v0[1] ) / mapBox[1] + 50;
  const width = 100 * viewBoxSize[0] / mapBox[0];
  const height = 100 * viewBoxSize[1] / mapBox[1];
  return <div className="minimap__viewBox"
  style={{'--viewBoxX': x + '%',
   '--viewBoxY': y + '%',
   '--viewBoxWidth': width + '%',
    '--viewBoxHeight': height + '%'}}>
  </div>
}

export default function MiniMap({coords, setCoordsAndRedraw, moveCoords, trees, mapLimits, viewBox, viewBoxSize, cullTrees, setCullTrees}) {
    const minimapRef = useRef(null);

    const mapBox = [mapLimits.v1[0] - mapLimits.v0[0], mapLimits.v1[1] - mapLimits.v0[1]];
    const mapAspectRatio = mapBox[1] / mapBox[0];
    const heightPercent = 400 * mapAspectRatio; // hardcoded to fill minimap Wrapper

    function moveToClicked(x, y) {
      const minimapRect = minimapRef.current.getBoundingClientRect();
      const miniMapCenter = [minimapRect.left + minimapRect.width / 2, minimapRect.top + minimapRect.height / 2];

      let newCoords = [(x - miniMapCenter[0]) / minimapRect.width * mapBox[0], (y - miniMapCenter[1]) / minimapRect.height * mapBox[1]];
      //center of viewbox
      newCoords = math.subtract(newCoords, [viewBoxSize[0] / 2, viewBoxSize[1] / 2]);
      newCoords = [math.max(newCoords[0], mapLimits.v0[0]), math.max(newCoords[1], mapLimits.v0[1])];
      newCoords = [math.min(newCoords[0], mapLimits.v1[0] - viewBoxSize[0]), math.min(newCoords[1], mapLimits.v1[1] - viewBoxSize[1])];
      setCoordsAndRedraw(newCoords);
    }

    return (
      <div className="minimap" tabIndex={0}
      onClick={(event) => {
        console.log(event);
        moveToClicked(event.clientX, event.clientY)
      }}
      onKeyDown={(event) => {
        const keyCode = event.code;
        if (keyCode === 'KeyW' || keyCode === 'ArrowUp') {
          moveCoords(0, -40)
        }
        if (keyCode === 'KeyS' || keyCode === 'ArrowDown') {
          moveCoords(0, 40)
        }
        if (keyCode === 'KeyA' || keyCode === 'ArrowLeft') {
          moveCoords(-40, 0)
        }
        if (keyCode === 'KeyD' || keyCode === 'ArrowRight') {
          moveCoords(40, 0)
        }
      }}
      >
        <label>
        <h2 className="title">minimap</h2>
        </label>

        <div
        ref={minimapRef}
          className="minimap-wrapper"
          style={{'--heightPercent': heightPercent + '%'}}>

          {
            trees.map((tree) =>
          <Element
            mapBox={mapBox}
            key={tree.id}
            position={tree.position}
            isDrawable={tree.visible}
            heightPercent={heightPercent}
            />
          )}

          <ViewBox viewBox={viewBox} viewBoxSize={viewBoxSize} mapBox={mapBox} coords={coords} heightPercent={heightPercent}/>
          </div>

        <div className="minimap__menu">

          <div>
            <input
              type="checkbox"
              checked={cullTrees}
              onChange={e => {
                setCullTrees(e.target.checked)
              }}
            />
            <label>
              Cull trees
            </label>
          </div>
        </div>
      </div>
    );
}

