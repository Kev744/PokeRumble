import React, {Fragment, useEffect, useReducer, useRef, useState} from 'react';
import Pokemon from './data/pokemon.json'
import Autocomplete from "./Autocomplete";
import Arrow from "./Arrow";
import './MissionDay.css'
import {useNavigate, useParams} from "react-router-dom";
import ShareSocialMedia from "./ShareSocialMedia";

const MissionDay = (props) => {

    const langKey = props.lang === 0 ? "french_name" : props.lang === 1 ? "english_name" : "german_name";

    const { id } = useParams()

    const navigate = useNavigate()

    const [inputPokemon, setInputPokemon] = useState("")

    const initialRef = useRef(false)


    function dayBefore() {
        const idMission = parseInt(id) - 1
        navigate(`../daily-mission/${idMission}`)
    }

    function dayAfter() {
        const idMission = parseInt(id) + 1
        navigate(`../daily-mission/${idMission}`)
    }


    function reducer(state, action) {
        // eslint-disable-next-line default-case
        switch (action.type) {
            case 'update' : {
                return { payload : action.payload, pokemon : action.payload.next(), index : 0, progression : Array.from({length : action.length})}
            }
            case 'changePokemon' : {
                const result = checkAnswer(inputPokemon, state.pokemon.value[langKey], state.index, state.progression)
                const actualPokemon = state.payload.next()
                return {...state, pokemon : actualPokemon, index : state.index + 1, progression: result}
            }

        }
    }

    const [state, dispatch] = useReducer(reducer, {pokemon : null})

    const total = state?.progression?.filter(x => x?.props.className === 'right').length


    useEffect(() => {
        const fetchMissionDay = async () => {
            try {
                    initialRef.current = true;

               if (!id) {
                   const res = await fetch("/server/daily-mission");
                   const data = await res.json();
                   const todayId = data.day.toString()

                   dispatch({
                            type: 'update',
                            payload: data.message.map(id => Pokemon.find(pok => pok.id === id)).values(),
                            length: data.message.length
                        });
                        // Navigate only after setting the day
                        navigate(`${todayId}`);
                }

                else {

                    const res = await fetch(`/server/daily-mission/${id}`);
                    const data = await res.json();

                    dispatch({
                        type: 'update',
                        payload: data.message.map(y => Pokemon.find(x => x.id === y)).values(),
                        length: data.message.length
                    });



                }
            } catch (error) {
                await navigate('../daily-mission')
                console.error("Error fetching mission day data:", error);
            }

        };

        fetchMissionDay();


    }, [id, initialRef.current]);




    function checkAnswer(input_name, real_name, index, progressionState) {


        setInputPokemon('')


        if (input_name.toLowerCase() === real_name.toLowerCase()) {
            return progressionState.map((x, i) => i === index ?
                <span className={'right'} style={{
                    backgroundColor: 'limegreen',
                    color: 'white',
                    overflow: 'hidden',
                    margin: '0 auto',
                    width: '100%',
                    fontWeight: 'bolder'
                }}>{String.fromCharCode(0x2713)}</span> : x)
        }

        else {
            return progressionState.map((x, i) => i === index ?
            <span className={'wrong'} style={{
                backgroundColor: 'red',
                color: 'white',
                overflow: 'hidden',
                margin: '0 auto',
                width: '100%',
                fontWeight: 'bolder'
            }}>{String.fromCharCode(0x2715)}</span> : x)
        }

    }





    return (
        <div className="questDay">
            {!state.pokemon ? <div>Waiting from data... <br/> If not working, try to refresh the page or contact me from 'About' page </div> : (state.pokemon.done ?
                (<div>
                    <p> You have actually
                        found {total}/{state.progression.length} Pokémon
                        of the daily quest  </p>

                    <ShareSocialMedia lang={props.lang} nbPokemonUser={total} nbPokemon={state.progression.length} contentKey={'missionDayShareTitle'}/>

                </div>)
                :
                (
                    <Fragment>
                        <div className='img-arrow-container'>
                        {state.pokemon.value &&
                            <img src={require(`./images/${state.pokemon.value.id}.png`)} alt={""}/>}
            <Arrow id="leftDaily" onClick={() => dayBefore()} text="Day Before"/>
            <Arrow id="rightDaily" onClick={() => dayAfter()} text="Day After"/>
        </div>
        <div className="input-button-wrapper">
            <div className='autocomplete-container'>
                <Autocomplete suggestions={Pokemon.map(x => x[langKey])} name={inputPokemon}
                              onNameChange={setInputPokemon}/>
            </div>
            <button id='missionButton' onClick={() => {
                dispatch({type: 'changePokemon'})
            }}> Send
            </button>
        </div>
        <div className='wrapper-info-progression'>
            <div className="progression">
                {state.progression && state.progression.map((id, i) => <p key={i}> {id} </p>)}
            </div>
        </div>
    </Fragment>
))}

</div>
)
}

export default MissionDay;