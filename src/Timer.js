import React from 'react';
import {Fragment} from "react";
import {encryptStorage} from "./utils/storage";
import {hashValue} from "./utils/hash";
import Cookies from "js-cookie";


class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            intervalId: null,
            isPaused: false
        };
    }

    componentDidMount() {
        this.initialState();
        window.addEventListener('beforeunload', this.addTimer)
    }

    addTimer = async () => {

        if (await this.props.isReset) {
            await localStorage.removeItem('hs');
            await encryptStorage.removeItem('timer')
            this.props.setReset(false)
        }

        else {
            const pokemonHash = await encryptStorage.getItem('pokemonRec', false);


            await encryptStorage.setItem("timer", this.state.timer);

            const hs = await hashValue(JSON.stringify({timer: this.state.timer, pokemon: pokemonHash}))
            localStorage.setItem('hs', hs)

        }

    }

    async componentWillUnmount() {
        await this.addTimer()
        window.removeEventListener('beforeunload', this.addTimer)
    }

    initialState = () => {

        const initialTimer = parseInt(encryptStorage.getItem("timer", false)) || 0;
        const hours = Math.floor(initialTimer / 3600);
        const minutes = Math.floor(initialTimer / 60) % 60;
        const seconds = initialTimer % 60;

        this.setState({
            timer: initialTimer,
            hours,
            minutes,
            seconds,
        }) ;


        this.props.setTimerApp(initialTimer)

    }

    incrementTimer = () => {
        const newTimerValue = this.state.timer + 1;
        const hours = Math.floor(newTimerValue / 3600);
        const minutes = Math.floor(newTimerValue / 60) % 60;
        const seconds = newTimerValue % 60;

        // Update state with the new timer values
        this.setState({
            timer: newTimerValue,
            hours,
            minutes,
            seconds,
        });

        // Update parent component's timer (if needed)
        this.props.setTimerApp(newTimerValue);

    };

    startTimer = () => {
        if (!this.state.intervalId) {
                this.props.handleTimer(false);
                this.props.updateForm(true, false);
                const intervalId = setInterval(this.incrementTimer, 1000);
                this.setState({intervalId});
        }
    };

    stopTimer = () => {
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
            this.setState({ intervalId: null });
        }
        this.props.handleTimer(true);
        this.props.updateForm(false, false);
    };

    resetTimer = () => {
        this.setState({ timer: 0, hours: 0, minutes: 0, seconds: 0 });
        encryptStorage.removeItem('dataRecord');
        Cookies.remove("record", {path : "/"})
        this.stopTimer();
        this.props.setTimerApp(0);
    };

    render() {
        const { hours, minutes, seconds, isPaused } = this.state;

        if (this.props.mode === 1) {
            return (
                <span className="containerTimer">

                    <div
                        className="timerHTML"
                    >
                        <p>
                        {hours.toString().padStart(2, "0")}:
                        {minutes.toString().padStart(2, "0")}:
                        {seconds.toString().padStart(2, "0")}
                        </p>
                    </div>
                    <button type="button" id='timerOptions' onClick={() => this.setState( {isPaused : !isPaused}, () => isPaused ? this.startTimer() : this.stopTimer())}>
                        <span> {isPaused ? String.fromCodePoint(0x23F5) : String.fromCodePoint(0x23F8)} </span>
                    </button>
                </span>
            );
        }
        else { return (<></>)}
    }
}

export default React.forwardRef((props, ref) => <Timer ref={ref} {...props} />);
