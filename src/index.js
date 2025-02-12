import React, { Fragment, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import logo from "./data/LogoPokemon.png";
import Pokedex from "./Pokedex";
import GenerationProgress from "./GenerationProgress";
import {getLocalizedString} from "./utils/TranslationData"
import {Link, Routes, Route, BrowserRouter, useLocation, useParams, Navigate} from "react-router-dom";
import Cookies from "js-cookie"
import About from "./about";
import Record from "./Record";
import MissionDay from "./MissionDay";
import {Helmet} from "react-helmet";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
            isOpenedMenu: false,
        };
    }

    changeLanguage = (e) => {
        const clickedElement = e.target.closest("li");
        if (clickedElement) {
            const lang = parseInt(clickedElement.getAttribute("value"));
            const MapLang = ["fr", "en", "de"];
            Cookies.set("langId", lang, { expires: 30 });
            const langName = MapLang[lang] || "en";
            this.setState({
                langId: lang,
                langName,
            });
            this.props.setLangActive(true);
        }
    };

    changeMode = (mode) => {
        this.setState({ mode });
    };

    toggleMenu = () => {
        this.setState((prevState) => ({
            isOpenedMenu: !prevState.isOpenedMenu,
        }));
    };

    componentDidMount() {
        const MapLang = ["fr", "en", "de"];
        const lang = this.props.lang || MapLang[this.state.langId] || Cookies.get('langName') || "en";
        const langId = MapLang.indexOf(lang);

        Cookies.set("langName", lang, { expires: 30 });

        this.setState({
            langId,
            langName: lang,
        });
        this.props.setLangActive(true);
    }

    render() {
        const { langId, langName, mode, isOpenedMenu } = this.state;
        const { langActive, location } = this.props;

        const navTemplates = {
            0: (
                <Fragment>
                    <Link to={`/${langName}/`}>Jouez</Link>
                    <Link to={`/${langName}/Pokedex`}>Mon Pokédex</Link>
                    <Link to={`/${langName}/generationProgress`}>Progression</Link>
                    <Link to={`/${langName}/recordList`}>Top Classement</Link>
                    <Link to={`/${langName}/missionDay`}>Mission quotidienne</Link>
                    <Link to={`/${langName}/about`}>À propos</Link>
                </Fragment>
            ),
            1: (
                <Fragment>
                    <Link to={`/${langName}`}>Play</Link>
                    <Link to={`/${langName}/Pokedex`}>My Pokédex</Link>
                    <Link to={`/${langName}/generationProgress`}>Progression</Link>
                    <Link to={`/${langName}/recordList`}>Leaderboard</Link>
                    <Link to={`/${langName}/missionDay`}>Daily Mission</Link>
                    <Link to={`/${langName}/about`}>About</Link>
                </Fragment>
            ),
            2: (
                <Fragment>
                    <Link to={`/${langName}/`}>Spiele</Link>
                    <Link to={`/${langName}/Pokedex`}>Mein Pokédex</Link>
                    <Link to={`/${langName}/generationProgress`}>Fortschritt</Link>
                    <Link to={`/${langName}/recordList`}>Rangliste</Link>
                    <Link to={`/${langName}/missionDay`}>Tägliche Mission</Link>
                    <Link to={`/${langName}/about`}>Über</Link>
                </Fragment>
            ),
        };

        const navigationBar = (
            <nav id="nav">
                <Link to="/">
                    <img src={logo ?? null} className="App-logo" alt="logo" />
                </Link>
                {navTemplates[langId]}
                <div className="containerLang">
                    <ul className="langPanel" onClick={this.changeLanguage}>
                        <li value="0">
                            <img src={require("./language_image/fr.png") ?? null} alt="FR" />
                        </li>
                        <li value="1">
                            <img src={require("./language_image/uk.png") ?? null} alt="UK" />
                        </li>
                        <li value="2">
                            <img src={require("./language_image/ge.png") ?? null} alt="DE" />
                        </li>
                    </ul>
                </div>
            </nav>
        );

        const displayByScreen =
            window.innerWidth < 1000 ? (
                <Fragment>
                    <div
                        className="menu"
                        onClick={this.toggleMenu}
                        style={isOpenedMenu ? {display: 'inline-block'} : { border: "1px solid brown" }}
                    >
                        <p>
                            Menu{" "}
                            {isOpenedMenu
                                ? String.fromCodePoint(0x25bc)
                                : String.fromCodePoint(0x25b6)}
                        </p>

                        {isOpenedMenu && navigationBar}

                    </div>
                </Fragment>
            ) : (
                navigationBar
            );

        return (
            <div className="app">
                {displayByScreen}
                {langActive && (
                    <Navigate
                        to={`/${langName}${location}`}
                        replace
                        state={{ langActive: false }}
                    />
                )}
                <Helmet>
                    <html lang={langName}/>
                </Helmet>
                <Routes>
                    <Route path="/" element={<App lang={langId} changeMode={this.changeMode} />} />
                    <Route
                        path="/Pokedex"
                        element={<Pokedex lang={langId} mode={mode} />}
                    />
                    <Route
                        path="/generationProgress"
                        element={<GenerationProgress lang={langId} mode={mode} />}
                    />
                    <Route path="/recordList" element={<Record />} />
                    <Route
                        path="/missionDay/:id?"
                        element={<MissionDay lang={langId} />}
                    />
                    <Route path="/about" element={<About lang={langId} />} />
                    <Route
                        path="*"
                        element={<App lang={langId} changeMode={this.changeMode} />}
                    />
                </Routes>
                <footer id="credits">
                    {getLocalizedString(this.state.langId, 'footer')}
                </footer>
            </div>
        );
    }
}

const IndexWrapper = () => {
    const [langActive, setLangActive] = useState(false);
    const location = useLocation();
    const { lang } = useParams();
    const relativePath = location.pathname.split('/').slice(2).join('/');

    useEffect(() => {
        if (location.state?.langActive === false) {
            setLangActive(false);
        }
    }, [location.state]);

    return <Index lang={lang} location={`/${relativePath}`} langActive={langActive} setLangActive={setLangActive} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/:lang?/*" element={<IndexWrapper />} />
        </Routes>
    </BrowserRouter>
);

reportWebVitals();
