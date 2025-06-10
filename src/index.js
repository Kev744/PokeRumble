import React, { Fragment, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
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

    }

    render() {
        const { langId, langName, mode, isOpenedMenu } = this.state;
        const { langActive, location } = this.props;
        const routes = ['/', '/pokedex', '/pokedex-by-generation', '/leaderboard', '/daily-mission', '/about'];

        const navTemplates = routes.map((route, index) =>

            <Link to={`/${langName}${route}`}>
                {getLocalizedString(langId, 'routesDescription')[index]}
            </Link>
        )


        const navigationBar = (
            <nav id="nav">
                <Link to="/">
                    <img src={logo ?? null} className="App-logo" alt="logo" />
                </Link>
                {navTemplates}
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
                    <Route
                        path="/:stats?"
                        element={<App lang={langId} changeMode={this.changeMode}  />}
                    />

                    <Route
                        path="/pokedex"
                        element={<Pokedex lang={langId} mode={mode} />}
                    />
                    <Route
                        path="/pokedex-by-generation"
                        element={<GenerationProgress lang={langId} mode={mode} />}
                    />
                    <Route path="/leaderboard" element={<Record />} />
                    <Route
                        path="/daily-mission/:id?"
                        element={<MissionDay lang={langId} />}
                    />
                    <Route path="/about" element={<About lang={langId} />} />
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

