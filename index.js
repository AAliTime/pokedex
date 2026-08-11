
async function search() {
    loadSpr();
    loadName();
    loadID();
    loadTypes();
    loadStats();
}

// Busco el nombre del pokemon con la API
async function getPokemon(nombre) {
    try {
        const URL = `https://pokeapi.co/api/v2/pokemon/${nombre}`;
        const response = await fetch(URL);

        if (!response.ok){
            throw new Error(`HTTP ${response.status}: ${nombre} no encontrado`)
        }

        const data = response.json();
        console.log(data)
        return data;

    } catch (error){
        console.error('Error al obtener pokémon', error.message);
        throw error;
    }
}

//nombre
function loadName(name) {
    const nameTag = document.getElementById("name")
    nameTag.innerHTML = `${name}`;
    console.log(`${name}`)
}

//id
function loadID(id) {
    const idTag = document.getElementById("identification")
    idTag.innerHTML = `${id}`;
    console.log(id);
}

//tipos
function loadTypes(types) {
    const typesTag = document.getElementById("types")
    const pokeType = types.map(t => `<span>${t.type.name} </span>`).join('');    
    if (types[1] == null){
        typesTag.innerHTML = pokeType;
        console.log(types.map(t => `${t.type.name}`));
    }else {
        typesTag.innerHTML = pokeType;
        console.log(types.map(t => `${t.type.name}`))
    }
}

//stats
function loadStats(stats) {
    const statsTag = document.getElementById("stats")
    statsTag.innerHTML = `${stats}`;
}

async function search() {
    const CONTENT = document.getElementById("pokemonInput").value;

    if (!CONTENT) return;

    try {        
        const POKEMON = await getPokemon(CONTENT);
        loadName(POKEMON.name);
        loadID(POKEMON.id);
        loadTypes(POKEMON.types);
    }catch (error){
        console.error('Error al obtener pokémon', error.message)
        throw error;
    }

}