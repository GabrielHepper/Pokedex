fetch(`https://pokeapi.co/api/v2/pokemon`)
  .then(response => response.json())
  .then(function(data) {
    let lista = document.getElementById("List")

    data.results.forEach(function(pokemon) {
      fetch(pokemon.url)
        .then(response => response.json())
        .then(function(pokemonData) {
          const pokemons = document.createElement("li");

          const pokemonType = pokemonData.types.length > 0 ? pokemonData.types[0].type.name : '';
          pokemons.classList.add(`type-${pokemonType}`);

         
          pokemons.id =`pokemon${pokemonData.id}`

          pokemons.innerHTML = `
            <div class="foto">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png" alt="Foto do Pokémon">
            <div class="tipo">
                    <p>${pokemonData.types[0].type.name}</p>  <span>${pokemonData.types[1] ? pokemonData.types[1].type.name : ''}</span>
                </div>
            </div>

            <div class="direita">
              <div class="nome">
                  <p>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</p>
              </div>

              <div class="buttonDiv">
                <button class="adicionarButton" onClick="adiciona(${pokemonData.id})">Adicionar</button>
                <button class="detalhesButton">Detalhes</button>
              </div>
            </div>
          `;

          if (pokemonType) {
            const type = pokemonData.types[0].type.name;
            if (type === "grass" ) {
                pokemons.style.color = "rgb(2, 194, 2)";
            } else if (type === "fire") {
                pokemons.style.color = "red";
            } else if (type === "water") {
                pokemons.style.color = "rgb(80, 80, 270)";
            }
          }

          lista.appendChild(pokemons);
        })
    })
  });

  function adiciona(id) {
    const div = document.getElementById(`pokemon${id}`)
    div.remove()
    console.log("Pokémon adicionado com sucesso!");
  };
