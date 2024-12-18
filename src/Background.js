export default function Background({bgimage, moveCoords, coords, viewBoxSize}) {
  return (
    <div className="gameBackground"
      style={{'--coordsX': -coords[0] + 'px',
      '--coordsY': -coords[1] + 'px',
      '--viewWidth': viewBoxSize[0] + 'px',
      '--viewHeight': viewBoxSize[1] + 'px',
        '--bgimage': 'url(' + bgimage + ')'}}
        onClick={(event) => {
          moveCoords( event.screenX - viewBoxSize[0] / 2, event.screenY - viewBoxSize[1] / 2)
        }}
        >
      </div>
  )
}
