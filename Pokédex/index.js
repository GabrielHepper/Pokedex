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
                <button class="detalhesButton" onClick="abrirDialog(${pokemonData.id})">Detalhes</button>
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
            } else if (type === "poison"){
                pokemons.style.color = "purple";
            }
          }

          lista.appendChild(pokemons);
        })
    })
  });

  function abrirDialog(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.json())
      .then(function(pokemonData) {
        const dialog = document.createElement('dialog');
        dialog.classList.add("dialog");
  
        const abilities = pokemonData.abilities.map(ability => ability.ability.name);
  
        const abilityPromises = abilities.map(abilityName =>
          fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`)
            .then(response => response.json())
        );
  
        Promise.all(abilityPromises)
          .then(abilityDataArray => {
            const abilitiesInfo = abilityDataArray.map((abilityData, index) => {
              const effectEntry = abilityData.effect_entries.find(entry => entry.language.name === 'en');
              const power = effectEntry?.effect ? 1 : 0; // Verifica se há algum efeito
  
              const barWidth = Math.min(power * 100, 100);
  
              return `
                <div class="status">
                  <p>${abilities[index]}</p>
                  <div class="barra-dano-container">
                    <div class="barra-dano" style="width: ${barWidth}%"></div>
                    <div class="numero-dano">${power}</div>
                  </div>
                </div>
              `;
            });
  
            dialog.innerHTML = `
              <div class="nomeDialog">
                <h2>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
              </div>
              ${abilitiesInfo.join('')}
            `;
  
            document.body.appendChild(dialog);
  
            dialog.addEventListener('click', function(event) {
              if (event.target === dialog) {
                dialog.close();
              }
            });
  
            dialog.showModal();
          });
      });
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  function adiciona(id) {
    const div = document.getElementById(`pokemon${id}`)
    div.remove()
    console.log("Pokémon adicionado com sucesso!");
  };
