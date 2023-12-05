fetch(`https://pokeapi.co/api/v2/pokemon`)
  .then(response => response.json())
  .then(function (data) {
    let lista = document.getElementById("List");

    data.results.forEach(function (pokemon) {
      fetch(pokemon.url)
        .then(response => response.json())
        .then(function (pokemonData) {
          const pokemons = document.createElement("li");

          const pokemonType = pokemonData.types.length > 0 ? pokemonData.types[0].type.name : '';
          pokemons.classList.add(`type-${pokemonType}`);

          pokemons.id = `pokemon${pokemonData.id}`;

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

          const nomePokemon = pokemons.querySelector('.nome p');
          const tipoPokemon = pokemons.querySelector('.tipo p');
          const tipoPokemon2 = pokemons.querySelector('.tipo span');



          if (pokemonData.types) {
            pokemonData.types.forEach(type => {
              if (type.type.name === "grass") {
                nomePokemon.style.color = "rgb(2, 194, 2)";
              } else if (type.type.name === "fire") {
                nomePokemon.style.color = "red";
              } else if (type.type.name === "water") {
                nomePokemon.style.color = "rgb(80, 80, 270)";
              } else if (type.type.name === "bug"){
                nomePokemon.style.color = "brown";
              } else if (type.type.name === "normal"){
                nomePokemon.style.color = "gray";
              } 
            });
          }

          if (pokemonData.types[0]) {
            pokemonData.types.forEach(type => {
              if (type.type.name === "grass") {
                tipoPokemon.style.color = "rgb(2, 194, 2)";
              } else if (type.type.name === "fire") {
                tipoPokemon.style.color = "red";
              } else if (type.type.name === "water") {
                tipoPokemon.style.color = "rgb(80, 80, 270)";
              } else if (type.type.name === "bug"){
                tipoPokemon.style.color = "brown";
              } else if (type.type.name === "normal"){
                tipoPokemon.style.color = "gray";
              }
            });
          }

          if (pokemonData.types[1]) {
            pokemonData.types.forEach(type => {
              if (type.type.name === "grass") {
                tipoPokemon2.style.color = "rgb(2, 194, 2)";
              } else if (type.type.name === "fire") {
                tipoPokemon2.style.color = "red";
              } else if (type.type.name === "water") {
                tipoPokemon2.style.color = "rgb(80, 80, 270)";
              } else if (type.type.name === "bug"){
                tipoPokemon2.style.color = "rgb(82, 21, 21)";
              } else if (type.type.name === "normal"){
                tipoPokemon2.style.color = "rgb(116, 116, 187)";
              } else if (type.type.name === "poison"){
                tipoPokemon2.style.color = "purple";
              } else if (type.type.name === "flying"){
                tipoPokemon2.style.color = "rgb(116, 116, 187)";
              }
            });
          }

          lista.appendChild(pokemons);
        });
    });
  });





  function abrirDialog(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.json())
      .then(function (pokemonData) {
        const dialog = document.createElement('dialog');
        dialog.classList.add("dialog");
  
        const abilities = pokemonData.abilities.map(ability => ability.ability.name);
  
        const abilityPromises = abilities.map(abilityName =>
          fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`)
            .then(response => response.json())
        );
  
        const statsPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then(response => response.json());
  
        Promise.all([Promise.all(abilityPromises), statsPromise])
          .then(([abilityDataArray, statsData]) => {
            const abilitiesInfo = abilityDataArray.map((abilityData, index) => {
              const effectEntry = abilityData.effect_entries.find(entry => entry.language.name === 'en');
              const power = effectEntry?.effect ? 1 : 0;
  
              const barWidth = Math.min(power * 100, 100);
  
              return `
                <div class="status">
                  <p>${abilities[index]}</p>
                  <div class="barra-dano-container">
                    <div class="barra-dano" style="width: ${barWidth}%;"></div>
                    <div class="numero-dano">${power}</div>
                  </div>
                </div>
              `;
            });
  
            const statsInfo = statsData.stats.map(stat => `
              <div class="status">
                <p>${stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}</p>
                <div class="barra-dano-container">
                  <div class="barra-dano" style="width: ${stat.base_stat}%;"></div>
                  <div class="numero-dano">${stat.base_stat}</div>
                </div>
              </div>
            `).join('');
  
            dialog.innerHTML = `
              <div class="nomeDialog">
                <h2>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
              </div>
              ${abilitiesInfo.join('')}
              ${statsInfo}
            `;
  
            document.body.appendChild(dialog);
  
            dialog.addEventListener('click', function (event) {
              if (event.target === dialog) {
                dialog.close();
              }
            });
  
            const allBars = dialog.querySelectorAll('.barra-dano');
  
            if (pokemonData.types[0]) {
              const primaryType = pokemonData.types[0].type.name;
              const typeColor = getTypeColor(primaryType);
  
              allBars.forEach(bar => {
                bar.style.backgroundColor = typeColor;
              });
            }
  
            dialog.showModal();
          });
      });
  }
  
  function getTypeColor(typeName) {
    if (typeName === "grass") {
      return "rgb(2, 194, 2)";
    } else if (typeName === "fire") {
      return "red";
    } else if (typeName === "water") {
      return "rgb(80, 80, 270)";
    } else if (typeName === "bug") {
      return "brown";
    } else if (typeName === "normal") {
      return "gray";
    } else {
      return "black";
    }
  }
  
  
  function adiciona(id) {
    const div = document.getElementById(`pokemon${id}`)
    div.remove()
    console.log("Pokémon adicionado com sucesso!");
  };
