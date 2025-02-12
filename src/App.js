import './App.css';
import Pokemon from './data/pokemon.json';
import Arrow from './Arrow';
import React from 'react';
import Autocomplete from "./Autocomplete";
import {Fragment} from "react";
import Timer from "./Timer";
import Dialog2 from "./Dialog2";
import Const from "./utils/Const";
import {encryptStorage} from "./utils/storage";
import {hashValue} from "./utils/hash";
import {getLocalizedString} from "./utils/TranslationData"


// eslint-disable-next-line no-undef
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            textPokemon : "",
            evaluateAnswer : "",
            listPokemon : [],
            disableInput : false,
            displayBackArrow: true,
            displayElem: {pokemon: true, form : false},
            timer: null,
            dialogDel: React.createRef(),
            dialog : React.createRef(),
            dialogInit: React.createRef(),
            buttonStop : React.createRef(),
            mode: 0,
            email1:"",
            email2:"",
            incrementCountToPokemonIndex:0,
            defilementPokemon:0,
            answer: null,
            last10Pokemon: [],
            isReset: false,
        };
    }


    confirmResetProgression = () => {
        const modeName = Const.getModeName(this.state.mode)
        encryptStorage.removeItem(modeName)
        this.initialPokedex();
        if(this.state.mode===1) {
            this.setState( { isReset : true})
            this.state.buttonStop.current.resetTimer()
        }
        this.setState({disableInput : false}, () => {this.updateDisplayFormStatus( true, false);         this.changeMode(0)});
    }

    refreshKnownPokemon(initialList, listFilter) {
        const langKey = this.props.lang === 0 ? "french_name" : this.props.lang === 1 ? "english_name" : "german_name";
        return initialList.filter(y => listFilter.map(x => x[langKey]).indexOf(y[langKey]) === -1);
    }

    selectDefilementPokemon = (stateDefilement) => {
        this.setState({defilementPokemon : stateDefilement});
        if(stateDefilement === 0) { this.randomPokemon(); }
        else {this.byOrderPokemon();}
    }


    randomPokemon = () => {
        const min = 0;
        const max = this.refreshKnownPokemon(Pokemon, this.state.listPokemon).length - 1;
        const rand = Math.floor(min + Math.random() * (max - min));
        const actualPokemonId = Pokemon.find(x => x.id === this.refreshKnownPokemon(Pokemon, this.state.listPokemon)[rand].id)
        if (max === 0) {
            this.setState({count : -1})
            return;
        }
        this.setState({ count: actualPokemonId['id'], textPokemon : ""});

    }

    byOrderPokemon = (id = 0) => {
        const max = this.refreshKnownPokemon(Pokemon, this.state.listPokemon).length - 1;
        let newId = id;
        if(id < 0) {
            newId = max + id;
            this.setState({incrementCountToPokemonIndex : newId});
        }

        const pokemonById = this.refreshKnownPokemon(Pokemon, this.state.listPokemon)[newId]
        if (max === 0) {
            this.setState({count : -1})
            return;
        }
        this.setState({ count: pokemonById['id'], textPokemon : ""});

    }

    initialPokedex = () => {
        const modeName = Const.getModeName(this.state.mode)
        this.setState({ listPokemon: encryptStorage.getItem(modeName, false) || []}, () =>
        {this.randomPokemon(); this.props.changeMode(this.state.mode);});
    }

    componentDidMount() {
        this.initialPokedex();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.displayElem.pokemon !== this.state.displayElem.pokemon) {
            this.randomPokemon();
        }
        if((prevState.mode !== this.state.mode)) {
            this.initialPokedex();
            this.changeMode(this.state.mode);
        }
        if(prevProps.lang !== this.props.lang) {
            this.selectDefilementPokemon(this.state.defilementPokemon)
        }
    }

    async validatePokemon(real_pokemon, input_pokemon) {
        const actualPokemon = Pokemon.find(x => x.id === this.state.count)
        if (real_pokemon.toLowerCase() === input_pokemon.toLowerCase()) {
            const modeName = Const.getModeName(this.state.mode)
            this.setState({evaluateAnswer : 'correct', answer : null})
            setTimeout(r => r, 1000);
            this.setState(prevState => {
                const langKey = this.props.lang === 0 ? "french_name" : this.props.lang === 1 ? "english_name" : "german_name";
                const newPokemon = (() => {
                    const existingIndex = prevState.listPokemon.findIndex(x => x.id === actualPokemon.id);
                    if (existingIndex !== -1) {
                        // Update the existing Pokémon
                        const updatedList = [...prevState.listPokemon];
                        updatedList[existingIndex][langKey] = actualPokemon[langKey];
                        return updatedList;
                    } else {
                        // Add the new Pokémon
                        return [
                            ...prevState.listPokemon,
                            { id: actualPokemon.id, [langKey]: actualPokemon[langKey], gen: actualPokemon.gen }
                        ];
                    }
                })();
                encryptStorage.setItem(modeName, newPokemon)
                encryptStorage.setItem('timer', this.state.timer)
                if (this.state.mode === 1) {
                    const timer = encryptStorage.getItem("timer", false);
                    const pokemonRec = encryptStorage.getItem("pokemonRec", false);


                    // Update the hash in localStorage
                    hashValue(JSON.stringify({ timer : this.state.timer, pokemon : newPokemon })).then(
                        (computedHash) => {
                            localStorage.setItem("hs", computedHash);
                            const hashData = JSON.stringify({ timer : timer, pokemon : pokemonRec });
                            const computedHashCheck = encryptStorage.hash(hashData);

                            if (!(computedHashCheck === localStorage.getItem("hs"))
                            ) {
                                console.warn("Hash mismatch or tampered data detected!");
                            }
                        }
                    );

                }
                return {listPokemon: newPokemon}
            }, () => {this.selectDefilementPokemon(this.state.defilementPokemon);})
        } else {
            this.setState({ evaluateAnswer: "incorrect" , answer : real_pokemon.toUpperCase()});

            const notKnownIndex = actualPokemon.id;

            this.setState(prevState => ({
                last10Pokemon :  [...prevState.last10Pokemon, notKnownIndex].slice(-10)
            }))



            setTimeout(r => r, 1000);

            await this.selectDefilementPokemon(this.state.defilementPokemon);
        }

        setTimeout(() => {
            this.setState({ evaluateAnswer: "" });
        }, 1000);
    }


    updateDisplayFormStatus = (togglePoke, toggleForm) => {
        this.setState({
            displayElem : {
                pokemon : togglePoke,
                form : toggleForm
            }
        })
    }

    handleNameChange = textPokemon => {
        this.setState({textPokemon : textPokemon})
    }

    handleStop = (disableInput) =>  {
        this.setState({disableInput})
    }

    pokemonLang = (listPokemon, lang) => {
       return listPokemon.map((x) => {
           const k = Object.keys(x);
           return x[k[parseInt(lang)+1]]
           }
       )
    }

    setTimer = (timer) => {
        this.setState({timer})
    }

    changeMode = (mode) => {
        this.setState({mode})
        this.props.changeMode({mode})
    }

    checkLength = (e, nb) => {

        /*
        const range = (start, stop, step) => Array.from({length : Math.ceil(((stop - start) / step))}, (_,i) => start + i * step)
        const mileStone = range(50, Pokemon.length, 50)
        const progression = (nb) => {
            return mileStone.filter(x => x < nb).slice(-1)
        }

        if (nb <= 50) {
            alert("You need to find 50 Pokemon in order to save")
            ///e.preventDefault();
            this.updateDisplayFormStatus(true, false);
        }
        */
        this.state.buttonStop.current.stopTimer();
        this.setState({email1 : encryptStorage.getItem('dataRecord', false) || '',
            email2 : encryptStorage.getItem('dataRecord', false) || ''})
        this.updateDisplayFormStatus(false, true);
        /*
        else if (nb === progression(nb)) {
            alert(`You have found ${nb} Pokemon`)
            this.updateDisplayFormStatus(false, true);
         */
        }

    checkBeforeSubmit = () => {

        encryptStorage.setItem("timeSaved", (this.state.ts + 1).toString())
        this.setState({ts : encryptStorage.getItem("timeSaved", false) || 0})
        this.updateDisplayFormStatus(false, true);
        alert(`It remains you ${2 - this.state.ts} number of saving from this round.`)

        if (this.state.ts === 2) {
            this.updateDisplayFormStatus(false, false);
            this.state.dialog.current.setStatusTimerOnForm(true);
            this.setState({mode : 0})
            encryptStorage.removeItem('timeSaved')

        }
    }

    claimToken = async (hash) => {
         await fetch('/server/token.php', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({hash}),
         })
    }


    render() {
        const { listPokemon, timer, count } = this.state;
        const remaining = this.refreshKnownPokemon(Pokemon, listPokemon).length
        const actualPokemonObj = Pokemon.find(x => x.id === count)
        const langKey = this.props.lang === 0 ? "french_name" : this.props.lang === 1 ? "english_name" : "german_name";
        const situationMode = this.state.mode === 0 ? 'Normal' : 'Record';
        const langId = this.props.lang

        const buttonSwitchMode = (mode) => {
            if(mode === 0) {
                return (
                    <Fragment>
                        <label style={{textAlign : "center"}}>
                            🎁 {getLocalizedString(this.props.lang, 'infoRecord')}
                            <br />
                        </label>
                        <button
                            type="button"
                            style={{
                                color: "#fff",
                                fontSize: "16px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "0.3s",
                            }}
                            onClick={() => {
                                this.changeMode(1);
                                this.state.dialogInit.current.openDialog();
                                this.handleStop(true);
                            }}
                        >
                            {getLocalizedString(this.props.lang, 'switchModeButton', { mode: 'Record' })}
                        </button>
                    </Fragment>
                )
            }
            else {
                return (<button
                    type="button"
                    onClick={() => {
                        this.updateDisplayFormStatus(true, false);
                        this.changeMode(0);
                    }}
                >
                    {getLocalizedString(this.props.lang, 'switchModeButton', {mode : 'Normal'})}
                </button>)
            }
        }

        return (
            <div className="appDomain">
                <em style={{"position" : "absolute", "right" : "0"}}>  {getLocalizedString(this.props.lang, "remainingPokemon", { count: remaining })}</em>
                <div className={"containerForm"}>
                <form className={`formPokemon ${this.state.evaluateAnswer}`} id="pokemonQuery" onSubmit={(e) => e.preventDefault()}>
                    <div className={"containerImg"}>
                        <div className={"borderImg"}>
                            {
                                this.state.count === -1 ? <em> You have found all possible Pokemon ! If you want to retry, reset your progression by clicking on and don't forget to save you if you are in 'Record' mode </em> :
                                this.state.displayElem.pokemon ? <img
                                        src={require(`./images/${actualPokemonObj.id}.png`)}
                                        alt={"not found"}
                                    /> : <em> No Pokemon to display ! </em>

                            }
                        </div>
                    </div>

                    <div className="input-button-wrapper">
                        {(this.state.mode === 0 && this.state.answer) && <em> Answer : {this.state.answer} </em>}
                        <div className="autocomplete-container">
                            <Autocomplete suggestions={this.pokemonLang(Pokemon, this.props.lang)} name={this.state.textPokemon} onNameChange={this.handleNameChange} disableInput={this.state.disableInput}/>
                        </div>
                        <Arrow
                            id="left"
                            text="Back"
                            display={this.state.back}
                            onClick={() => {
                                if (this.state.defilementPokemon === 0) {
                                    this.setState((prevState) => {
                                    const last10Pokemon = [...prevState.last10Pokemon]; // Create a copy to avoid direct mutation
                                    const previousCount = last10Pokemon.pop(); // Remove the last Pokemon
                                    if(previousCount) {this.handleStop(true);
                                        this.setState({count : previousCount, answer : Pokemon.find(x => x.id === previousCount)[langKey]})}
                                    else {this.setState({back : 'none'})}
                                    return {
                                        last10Pokemon,
                                    };
                                });
                            }
                            else {
                                    this.setState((prevState) => {
                                    const decrementedCount = prevState.incrementCountToPokemonIndex - 1;
                                    this.byOrderPokemon(decrementedCount)
                                    return {incrementCountToPokemonIndex : decrementedCount}
                                    })
                            }
                            }}
                        />
                        <Arrow id="right" text="Pass" onClick={() => {
                            if (this.state.defilementPokemon === 0) {
                                this.randomPokemon();
                                this.setState(prevState => ({
                                    answer: actualPokemonObj[langKey],
                                    last10Pokemon: [...prevState.last10Pokemon, actualPokemonObj['id']],
                                    back: 'true'
                                }))
                            }
                            else {
                                this.setState((prevState) => {
                                    const incrementedCount = prevState.incrementCountToPokemonIndex + 1;
                                    this.byOrderPokemon(incrementedCount)
                                    return {incrementCountToPokemonIndex : incrementedCount}
                                })
                            }
                        }
                        }/>

                        <button title={"Guess the Pokemon !"} id={"queryPokemon"} onClick= { () => this.validatePokemon(this.pokemonLang([actualPokemonObj], this.props.lang)[0], this.state.textPokemon)} type={"submit"}/>
                    </div>

                </form>
                </div>

                {this.state.mode === 1 && (<Timer
                    ref={this.state.buttonStop}
                    handleTimer={this.handleStop}
                    setTimerApp={this.setTimer}
                    updateForm={this.updateDisplayFormStatus}
                    mode={this.state.mode}
                    isReset={this.state.isReset}
                />)}

                <div className="selectionMode">
                    {buttonSwitchMode(this.state.mode)}

                    {this.state.mode === 1 && (

                        <Fragment>
                            <div className="selectionMode">

                                <p>{getLocalizedString(this.props.lang, 'timerConfiguration')['options']}</p>
                                <button type="button" onClick={() => this.state.buttonStop.current.startTimer()}>
                                    {getLocalizedString(this.props.lang, 'timerConfiguration')['start']}
                                </button>
                                <button type="button" onClick={() => this.state.buttonStop.current.stopTimer()}>
                                    {getLocalizedString(this.props.lang, 'timerConfiguration')['stop']}
                                </button>
                            </div>
                            <p>{getLocalizedString(this.props.lang, "savingInformation")}</p>
                            <button
                                onClick={(e) => {
                                    this.checkLength(e, 50)
                                }}
                                type={'button'}
                            >
                                {getLocalizedString(this.props.lang, 'saveButton')}
                            </button>
                            {this.state.displayElem.form && (
                                <div className={"formRecord"}>
                                    <p>{getLocalizedString(this.props.lang, "formExplanation")}</p>
                                    <form
                                        id="registerRecord"
                                        target="_parent"
                                        onSubmit={async (event) => {
                                            event.preventDefault(); // Prevent default form submission

                                            if (this.state.email1.trim() !== this.state.email2.trim()) {
                                                alert("Check your email");
                                                return;
                                            }

                                            try {
                                                const url = `/server/record.php`;
                                                const email = this.state.email1.trim();

                                                const pokemons = () => {
                                                    return listPokemon.filter(x => {
                                                        const k = Object.keys(x);
                                                        return k.includes(langKey)
                                                    }).length
                                                }

                                                const nbPok = await pokemons()


                                                await this.claimToken({nbPok, langId, timer, email});

                                                const response = await fetch(url);
                                                const data = await response.json();


                                                const emailExists = await data.message.some(entry => entry.email === email);

                                                const formData = await ({
                                                    email,
                                                    nickname: document.getElementById('inpNickname').value,
                                                });

                                                const method = await emailExists ? 'PATCH' : 'POST';

                                                await fetch(url, {
                                                    method: method,
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(formData),
                                                });

                                                await encryptStorage.setItem('dataRecord', email);



                                                window.location.href = window.location.pathname+"recordList";

                                            }
                                            catch (error) {
                                                console.error('Request failed', error);
                                            }
                                        }}
                                    >
                                        <span>
                                        <label htmlFor={"inpNickname"}>Nickname:</label>
                                        <input
                                            id={"inpNickname"}
                                            required={true}
                                            name={"nickname"}
                                            maxLength={10}
                                            placeholder={getLocalizedString(this.props.lang,"nicknamePlaceholder")}
                                        />
                                        </span>
                                        <br/>

                                        <span>
                                        <label htmlFor={"inpEmail"}>Email:</label>
                                        <input
                                            id={"inpEmail"}
                                            required={true}
                                            name={"email"}
                                            maxLength={75}
                                            disabled={!!localStorage.getItem('dataRecord')}
                                            placeholder={!!localStorage.getItem('dataRecord') ? encryptStorage.getItem('dataRecord', false): getLocalizedString(this.props.lang,"emailPlaceholder")}
                                            onChange={(e) => this.setState({ email1: e.target.value })}
                                            type={"email"}
                                        />
                                        </span>

                                        <br/>

                                        <span>
                                        <label htmlFor={"inpEmailConf"}>Confirm your email:</label>
                                        <input
                                            id={"inpEmailConf"}
                                            required={true}
                                            name={"emailConf"}
                                            maxLength={75}
                                            disabled={!!localStorage.getItem('dataRecord')}
                                            placeholder={!!localStorage.getItem('dataRecord') ? encryptStorage.getItem('dataRecord', false): getLocalizedString(this.props.lang,"emailPlaceholder")}
                                            onChange={(e) => this.setState({ email2: e.target.value })}
                                            type={"email"}
                                        />
                                        </span>

                                        <button type={"submit"}>Submit</button>
                                    </form>

                                </div>
                            )}
                        </Fragment>
                    )}

                    <p style={{textDecoration : 'underline'}}>
                        {getLocalizedString(this.props.lang, 'situationMode', {mode : situationMode})}
                    </p>


                    {this.state.mode === 0 && (
                        <div className="radioDisplayCurrentPokemon">
                            <p>{getLocalizedString(this.props.lang, 'displayPokemon')}</p>
                            <span>
        <input
            type="radio"
            id="randomMode"
            checked={this.state.defilementPokemon === 0}
            onChange={() => this.selectDefilementPokemon(0)}
        />
        <label htmlFor="randomMode">{getLocalizedString(this.props.lang, "labelDisplayPokemon")['random']}</label>
      </span>
      <span>
        <input
            type="radio"
            id="orderMode"
            checked={this.state.defilementPokemon === 1}
            onChange={() => this.selectDefilementPokemon(1)}
        />
        <label htmlFor="orderMode">{getLocalizedString(this.props.lang, "labelDisplayPokemon")['order']}</label>
      </span>
      </div>
      )}


                    <em style={{marginTop: '10px'}}>{getLocalizedString(this.props.lang, 'or')}</em>

                    <button
                        type="button"
                        onClick={() => this.state.dialogDel.current.openDialog()}
                    >
                        {getLocalizedString(this.props.lang, 'deleteProgressionButton',{mode : situationMode})}
                    </button>
                </div>


                <Dialog2 ref={this.state.dialogInit}>
                    {getLocalizedString(this.props.lang,"dialogReward")}
                    <button
                        type={"button"}
                        style={{padding: "5px", margin: "2px", background: 'greenyellow', cursor: 'pointer'}}
                        onClick={() => {
                            const timer = encryptStorage.getItem("timer", false);
                            const pokemonRec = encryptStorage.getItem("pokemonRec", false);


                            const hashData = JSON.stringify({ timer : timer, pokemon : pokemonRec });
                            const computedHash = encryptStorage.hash(hashData);

                            if ((!timer && !pokemonRec ) || (computedHash === localStorage.getItem("hs"))) {
                                this.state.dialogInit.current.closeDialog();
                                this.handleStop(false);
                            } else {
                                this.confirmResetProgression();
                                this.state.dialogInit.current.closeDialog();

                            }
                            this.state.buttonStop.current.startTimer();

                        }}
                    >
                        Start timer
                    </button>
                    <button type={"button"} style={{padding: "5px", margin: "2px", background: 'greenyellow', cursor: 'pointer'}} onClick={() => {this.state.dialogInit.current.closeDialog(); this.changeMode(0); this.handleStop(false); }}> Back to Normal Mode </button>

                </Dialog2>
                <Dialog2 ref={this.state.dialogDel}>
                   <p> {getLocalizedString(this.props.lang,"deleteProgression")} </p>
                   <button type={"reset"} style={{padding: "5px", margin: "2px", background: 'greenyellow', cursor: 'pointer'}} onClick={() => {this.state.dialogDel.current.closeDialog(); this.confirmResetProgression()}}> Reset </button>
                   <button type={"button"} style={{padding: "5px", margin: "2px", background: 'greenyellow', cursor: 'pointer'}} onClick={() => {this.state.dialogDel.current.closeDialog(); if(this.state.mode === 1) {this.state.buttonStop.current.startTimer()}}}> Continue </button>
                   <button type={"button"} style={{padding: "5px", margin: "2px", background: 'greenyellow', cursor: 'pointer'}} onClick={() => {this.state.dialogDel.current.closeDialog(); this.changeMode(0); this.handleStop(false); }}> Back to Normal Mode </button>

                </Dialog2>
                <Dialog2 ref={this.state.dialog} resetTimer={() => this.state.buttonStop.current.resetTimer()}
                         clearProgression={this.confirmResetProgression}
                         restartTimer={() => this.state.buttonStop.current.startTimer()}>
                    <p>Do you want to save this time or clear this one?
                        Save will relaunch
                        Clearing means that your personal time will be reset along with your progression.</p>
                    <button onClick={() => this.state.dialog.current.setStatusTimerOnForm(false)}>Continue</button>
                    <button onClick={() => this.state.dialog.current.setStatusTimerOnForm(true)}>Reset</button>
                    <button type={"button"} onClick={() => {this.state.dialogInit.current.closeDialog(); this.changeMode(0); this.handleStop(false); }}> Back to Normal Mode </button>
                    <button onClick={() => this.state.dialog.current.closeDialog()} type="button">
                        Close
                    </button> </Dialog2>

            </div>
        );
    }
}

export default App;
