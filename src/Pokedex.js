import React from 'react';
import './Pokedex.css'
import Const from './utils/Const'

function Pokedex(props) {

    const pokedex = Const.pokedexbyLang(props)

    if (!pokedex)
        return (<em> No Pokemon registered !</em>)

    return (
        <div className="pokedex">
            {pokedex.map((pokemon) => (
                <div id="container" key={pokemon.id}>
                    <img src={require(`./images/${pokemon.id}.png`)} alt={pokemon.name} />
                    <p>{pokemon.name.toUpperCase()}</p>
                </div>

                ))}
        </div>
    );
}


export default Pokedex;