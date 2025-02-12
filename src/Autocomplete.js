import React, { Component, Fragment } from "react";


class Autocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            rowStyle: {"background": "gray","color": "#fff"}
        };
    }


    onChange = e => {
        const {suggestions} = this.props;
        const userInput = e.target.value;

        this.props.disableInput ? this.props.onNameChange("") : this.props.onNameChange(userInput)


        const filteredSuggestions = suggestions.filter(
            suggestion =>
                suggestion.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().startsWith(userInput.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase())
        ).slice(0,5);

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
        });
    };

    onClick = e => {
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
        });
        this.props.disableInput ? this.props.onNameChange("") : this.props.onNameChange(e.target.innerText)

    };

    onMouseOver = e => {
        const {filteredSuggestions} = this.state;
        this.setState({
            activeSuggestion: filteredSuggestions.indexOf(e.target.innerText),
        });
    }

    onMouseLeave = () => {
        this.setState({
            showSuggestions : false
        })
    }

    onKeyDown = e => {
        const {activeSuggestion, filteredSuggestions} = this.state;

        if (e.key === "Enter") {
            if(filteredSuggestions[activeSuggestion] in window) {
                this.props.disableInput ? this.props.onNameChange("") : this.props.onNameChange(this.props.name)
            }
            else {
                this.props.disableInput ? this.props.onNameChange("") : this.props.onNameChange(filteredSuggestions[activeSuggestion])
                this.setState({showSuggestions : false})
            }

        } else if (e.key === "ArrowDown") {
            this.setState({activeSuggestion: activeSuggestion < filteredSuggestions.length - 1 ? activeSuggestion + 1 : 0});
        }


        else if (e.key === "ArrowUp") {
            this.setState({activeSuggestion: activeSuggestion > 0 ? activeSuggestion - 1 : filteredSuggestions.length - 1})
        }
    };

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            onMouseOver,
            onMouseLeave,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                rowStyle
            }
        } = this;




        let suggestionsListComponent;

        if (showSuggestions && this.props.name) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ul className="suggestions" onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                                return (
                                    <li style={rowStyle}
                                        className={className} key={suggestion} onClick={onClick}>
                                        {suggestion}
                                    </li>
                                );
                            }
                            return (


                                <li key={suggestion} onClick={onClick}>
                                    {suggestion}
                                </li>

                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div className="no-suggestions">
                        <em>No Pokemon available.</em>
                    </div>
                );
            }
        }

        return (
            <Fragment>
                <label>
                <input
                    type="text"
                    title="Type here the Pokemon name on the picture"
                    name="inputPokemonName"
                    disabled={this.props.disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onPaste={(e) => this.context.mode === 1 ? e.preventDefault() : e}
                    value={this.props.name}
                />
                </label>
                {suggestionsListComponent}
            </Fragment>
        );
    }
}

export default Autocomplete;
