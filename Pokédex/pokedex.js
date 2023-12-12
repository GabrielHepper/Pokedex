document.addEventListener("DOMContentLoaded", function () {
   let storedPokemon = JSON.parse(localStorage.getItem("pokemons"));
   let pokedexLista = document.getElementById("listaPokedex")

 storedPokemon.forEach(pokemon => {
        const div = document.createElement("div");
        div.innerHTML = pokemon.html;

        pokedexLista.appendChild(div);

        //console.log(pokemon.html)
        
    });
});

console.log(storedPokemon)