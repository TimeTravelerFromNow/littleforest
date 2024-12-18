
export default function FoundAnimals({foundAnimals, bgimage, assets, allFound}) {
  return (
    <div className={`foundAnimalsContainer ${allFound ? 'allFound' : ''}`}>
      <label>
        <h2 class="title">Found Animals</h2>
      </label>
      <div className="animalPicturesWrapper">
        {Object.keys(foundAnimals).map((animal) => (
          foundAnimals[animal] ?
          <div className="animalPicture" style={{'--bgimage': 'url(' + bgimage + ')'}}>
            <img src={assets[animal + '_0.png']} />
          </div>
          :
          <div className="animalPicture unknown">
            <span>?</span>

             </div>
        ))}
      </div>
    </div>
  )
}
