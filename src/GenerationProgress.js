import React, { useState, useEffect } from "react";
import Pokemon from './data/pokemon.json';
import "./GenerationProgress.css";
import CardCollector from "./data/CardCollector.jpg";
import Const from "./utils/Const";
import { useNavigate, useSearchParams } from "react-router-dom";


function GenerationProgress(props) {

    const [openedModal, setOpenModal] = useState(false);
    const [actualGen, changeGen] = useState(0);

    const importAll = r => r.keys().map(r);
    const imgs = importAll(require.context("./gen", false));


    const filteredJSON =  Const.pokedexbyLang(props) || [];

    const objectInit = Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, 0]));
    const generationCountObject = filteredJSON.map(x => x['gen']).reduce((acc, elem) => (
        acc[elem] += 1, acc
    ), objectInit);

    function compareName(a, b) {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    };

    // react-router hooks
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Update the component's state based on the URL query when the component mounts
    useEffect(() => {
        const genFromQuery = searchParams.get('gen');
        if (genFromQuery) {
            changeGen(parseInt(genFromQuery));
            setOpenModal(true);
        }
    }, [searchParams]);

    const closeModal = () => {
        setOpenModal(false);
        navigate(""); // Clear the query parameter when closing the modal
    };

    const modal = (
        <div className="modalOverlay" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                {filteredJSON.filter(pokemon => pokemon['gen'] === actualGen).sort(compareName).map((pokemon) => {
                    return (
                        <div key={pokemon.id} className="pokemonDisplay">
                            <img src={require(`./images/${pokemon.id}.png`)} alt={pokemon.name}/>
                            <p>{pokemon.name.toUpperCase()}</p>
                        </div>
                    );
                })}
                <button className="closeButton" onClick={closeModal}><span aria-hidden="true">&times;</span></button>
            </div>
        </div>
        )


    const changeTemplateLang = (lang) => {

        if(lang === 0) {
            return (
                <div className={"reduceCont"} style={{ position: 'relative' }}>
                    <div className="boxGen">
                        {Object.entries(generationCountObject).map(([gen, count], index) => (
                            <div
                                key={gen}
                                className={"containerGen"}
                                onClick={() => {
                                    setOpenModal(true);
                                    changeGen(parseInt(gen));
                                    navigate(`?gen=${gen}`);
                                }}
                            >
                                <img src={imgs[index]} alt={"Gen" + index} />
                                <em> Génération : {gen} </em>
                                <em> Pokémon trouvés : {count} / {Pokemon.map(x => x['gen']).filter(y => y === parseInt(gen)).length}</em>
                            </div>
                        ))}
                        <div className={"containerGen"} onClick={() => navigate('../Pokedex')}>
                            <img src={CardCollector} alt={"CarteCollecteur"} />
                            <em> Total </em>
                            <em>{filteredJSON.length} / {Pokemon.length}</em>
                        </div>
                    </div>
                    {openedModal && modal}
                </div>
            );
        }

        else if(lang === 1) {
            return (
                <div className="reduceCont" style={{ position: 'relative' }}>
                    <div className="boxGen">
                        {Object.entries(generationCountObject).map(([gen, count], index) => (
                            <div
                                key={gen}
                                className={"containerGen"}
                                onClick={() => {
                                    setOpenModal(true);
                                    changeGen(parseInt(gen));
                                    navigate(`?gen=${gen}`);
                                }}
                            >
                                <img src={imgs[index]} alt={"Gen" + index} />
                                <em> Generation: {gen} </em>
                                <em> Pokémon found: {count} / {Pokemon.map(x => x['gen']).filter(y => y === parseInt(gen)).length}</em>
                            </div>
                        ))}
                        <div className={"containerGen"} onClick={() => navigate('../Pokedex')}>
                            <img src={CardCollector} alt={"CollectorCard"} />
                            <em> Total </em>
                            <em>{filteredJSON.length} / {Pokemon.length}</em>
                        </div>
                    </div>

                    {openedModal && modal}
                </div>
            );
        }

        else if(lang === 2) {

            return (
                <div className={"reduceCont"} style={{ position: 'relative' }}>
                    <div className="boxGen">
                        {Object.entries(generationCountObject).map(([gen, count], index) => (
                            <div
                                key={gen}
                                className={"containerGen"}
                                onClick={() => {
                                    setOpenModal(true);
                                    changeGen(parseInt(gen));
                                    navigate(`?gen=${gen}`);
                                }}
                            >
                                <img src={imgs[index]} alt={"Gen" + index} />
                                <em> Generation: {gen} </em>
                                <em> Gefundene Pokémon: {count} / {Pokemon.map(x => x['gen']).filter(y => y === parseInt(gen)).length}</em>
                            </div>
                        ))}
                        <div className={"containerGen"} onClick={() => navigate('../Pokedex')}>
                            <img src={CardCollector} alt={"SammlerKarte"} />
                            <em> Gesamt </em>
                            <em>{filteredJSON.length} / {Pokemon.length}</em>
                        </div>
                    </div>

                    {openedModal && modal}
                </div>
            );

        }
    }

    return (
        changeTemplateLang(parseInt(props.lang))
    )
}

export default GenerationProgress;
