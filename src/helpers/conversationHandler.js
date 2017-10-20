const pokedex = require('../adapters/pokeapi');
const GREETINGS = ['hi', 'hey', 'hola', 'que onda', 'howdy'];

const isGreeting = text => GREETINGS.includes(text.toLowerCase());

const getByName = term => {
  pokedex.getPokemonByName(term).then(pokemon => {
    const { name, weight, height, base_experience: baseXp } = pokemon;
    
    const message = `
      Pokemon name: ${name}
      Weight: ${weight}
      Height: ${height}
      Base XP: ${baseXp}
    `;

    console.log(message);

    return message;
  }).catch(error => 'I\'m sorry, but that pokemon doesn\'t exist. 😟');
};

const process = text => {
  if(isGreeting(text)) {
    return Promise.resolve(`Hi there mate 👋🏻`)
  }

  return getByName(text);
};

module.exports = {
  process
};
