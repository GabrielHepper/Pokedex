fetch(`https://pokeapi.co/api/v2/pokemon`)
  .then(response => response.json())
  .then(function (data) {
    let lista = document.getElementById("listaPokemon")

    data.results.forEach(function (pokemon) {
      fetch(pokemon.url)
        .then(response => response.json())
        .then(function (pokemonData) {
          const pokemons = document.createElement("div");

          const pokemonType = pokemonData.types.length > 0 ? pokemonData.types[0].type.name : '';
          pokemons.classList.add(`type-${pokemonType}`);

          let tipos = pokemonData.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
          tipos = tipos.join('');

          pokemons.id = `pokemon${pokemonData.id}`;
          console.log(pokemonData.height)
          pokemons.innerHTML = `
          <div class="pokemon">
            <div class="foto">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png" alt="Foto do Pokémon">
            </div>

            <div class="informacao">
              <div class="nome">
                  <h2>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
              </div>
              <div class="tipo">
                ${tipos}
                </div>
              <div class="pokemon-status">
                <p class="statusAltura">${pokemonData.height/10}m</p>
                <p class="statusPeso">${pokemonData.weight/10}kg</p>
              </div>

              <div class="buttonDiv">
                <button class="adicionarButton" id="adicionar" onClick="adiciona(${pokemonData.id})">Adicionar</button>
                <button class="detalhesButton" onClick="abrirDialog(${pokemonData.id})">Detalhes</button>
              </div>
            </div>
          </div>
          `;

          lista.appendChild(pokemons);
          updateButtons();
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

      let tipos = pokemonData.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
      tipos = tipos.join('');

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

            // return `
            //     <div class="status">
            //       <div class="barra-dano-container">
            //       </div>
            //     </div>
            //   `;
          });

          const statsInfo = statsData.stats.map(stat => `
              <div class="status">
                <p>${stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}</p>
                <div class="barra-dano-container">
                  <div class="barra-dano" style="width: ${stat.base_stat}%;"></div>
                  <p class="numero-dano">${stat.base_stat}</p>
                </div>
              </div>
            `).join('');


          dialog.innerHTML = `
          <div class="content">
              <div class="conteudoDialog">
              <div>
              <div class="pokemonView">
                <p class="pokemon-id-back">#${pokemonData.id}</p>
                <div class="subgrid">
                <div class="picture">
                <img src="${pokemonData.sprites.front_default}" alt="Foto do Pokémon">
                <img src="${pokemonData.sprites.back_default}" alt="Foto do Pokémon de costas">
                </div>

                <div class="nomeDialog"<h2>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2></div>

                <div class="type">${tipos}</div>

                <div class="detalhes">
                <div class="row"><p>Altura:</p><span>${pokemonData.height/10}M</span></div>
                <div class="row"><p>Peso:</p><span>${pokemonData.weight/10}KG</span></div>
                </div>
                </div>
              </div>
              </div>
              </div>
              <div class="aviso">STATUS</div>
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
    return "#78C850";
  } else if (typeName === "fire") {
    return "#F08030";
  } else if (typeName === "water") {
    return "#6890F0";
  } else if (typeName === "bug") {
    return "#A8B820";
  } else if (typeName === "normal") {
    return "#A8A878";
  } else {
    return "black";
  }
}

function updateButtons() {
  storedPokemon.forEach(pokemon => {
    const div = document.getElementById(`pokemon${pokemon.id}`);
    const botao = div.querySelector(".adicionarButton");

    if (botao) {
      botao.innerHTML = "Remover";
    }
  });
}

let storedPokemon = JSON.parse(localStorage.getItem("pokemons")) || [];

function adiciona(id) {
  const div = document.getElementById(`pokemon${id}`);
  const botao = div.querySelector(".adicionarButton");

  let storedPokemon = JSON.parse(localStorage.getItem("pokemons")) || [];

  const existingPokemonIndex = storedPokemon.findIndex(pokemon => pokemon.id === id);

  if (existingPokemonIndex !== -1) {
    storedPokemon.splice(existingPokemonIndex, 1);
    botao.innerHTML = "Adicionar";
    console.log(`Pokémon com ID ${id} removido da Pokédex.`);
  } else {
    storedPokemon.push({ id, html: div.innerHTML });
    botao.innerHTML = "Remover";
    console.log(`Pokémon com ID ${id} adicionado à Pokédex.`);
  } 

  localStorage.setItem("pokemons", JSON.stringify(storedPokemon));

  console.log("Pokémon adicionado à Pokédex com sucesso!");
}