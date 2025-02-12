import React from 'react'
import {encryptStorage} from "./storage";
import Pokemon from "../data/pokemon.json";

class Const extends React.Component {

    static getModeName(mode)  {
        return mode === 0 ? "pokemonNorm" : "pokemonRec"
    }

    static pokedexbyLang(props) {

        const savedPokemon = encryptStorage.getItem(this.getModeName(props.mode), false);


        if (!savedPokemon) {
            return null;
        }

        return savedPokemon.map((item) => {
            const langKey = props.lang === 0 ? "french_name" : props.lang === 1 ? "english_name" : "german_name";
            const langPok = Pokemon.find(x => x.id === item.id)
            return {
                id: item.id,              // ID field
                gen: item.gen,
                name: langPok[langKey] // Dynamic language-based field
            };
        })
    }
}


export default Const