document.addEventListener("DOMContentLoaded", function () {
   let storedPokemon = JSON.parse(localStorage.getItem("pokemons")) || [];
   let pokedexLista = document.getElementById("listaPokedex")

 storedPokemon.forEach(pokemon => {
        const div = document.createElement("div");
        div.innerHTML = pokemon.html;

        pokedexLista.appendChild(div);

        const botao = div.querySelector(".adicionarButton");
        if (botao) {
          botao.innerHTML = "Remover";
      }

        botao.onclick = function() {
          removerPokemon(pokemon.id);
          div.style.display = "none";
        };

        const detalhes = div.querySelector("detalhesButton");
        if (detalhes) {
          detalhes.abrirDialog(pokemon.id)
        }
        
    });
});


function removerPokemon(id) {
  let storedPokemon = JSON.parse(localStorage.getItem("pokemons")) || [];
  const indexPokemon = storedPokemon.findIndex(pokemon => pokemon.id === id);

  if (indexPokemon !== -1) {
    storedPokemon.splice(indexPokemon, 1);
    localStorage.setItem("pokemons", JSON.stringify(storedPokemon));

    const divToRemove = document.getElementById(`pokemon${id}`);
    if (divToRemove) {
      divToRemove.parentNode.removeChild(divToRemove);
    }

    console.log(`Pokémon com ID ${id} removido da Pokédex.`);
  }

}



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
                  <div class="numero-dano">${stat.base_stat}</div>
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
                <div class="row"><p>Altura:</p><span>${pokemonData.height}M</span></div>
                <div class="row"><p>Peso:</p><span>${pokemonData.weight}KG</span></div>
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