import React, {useEffect, useState} from 'react';

const About = (props) => {

    const [XWidget, setXWidget] = useState(true)

    useEffect(() => {
        let script;
        if(XWidget) {
            script = document.createElement('script')

            script.src = "//platform.twitter.com/widgets.js"
            script.async = true
            script.defer = true
            script.onload = () => setXWidget(true)
            document.body.appendChild(script)

        }

        return () => {
            if (script) {
                script.remove()
            }
        }
    }, [XWidget, props.lang]);

    if(props.lang === 0) {
        return (
            <div className='informations'>
                <div className="about">
                    <h2>À propos de moi</h2>
                    <p>Bonjour à tous ! J’espère que vous appréciez ce quiz Pokémon et ses nombreuses fonctionnalités.</p>
                    <p>En tant que créateur et mainteneur de ce site, je suis passionné par le monde des Pokémon depuis mon enfance.</p>
                    <p>J’ai de nombreux souvenirs avec les jeux Pokémon sur Nintendo DS, j’ai collectionné une multitude de cartes et j’ai passé de nombreuses heures à jouer à Pokémon GO, Pokémon Unite & Pokemon TCG Pocket.</p>
                    <p>Ce site est ma manière de rassembler une communauté de fans qui peuvent se challenger et partager leurs connaissances sur les Pokémon.</p>
                    <p>Pour garantir une expérience agréable et fluide, j’ai décidé que ce site restera toujours sans publicités.</p>
                    <p>Actuellement, il s’agit de la toute première version du site. Je serais ravi de recevoir vos suggestions—que ce soit des recommandations, des retours, des demandes de fonctionnalités ou pour signaler des problèmes. Votre soutien aidera à améliorer cette plateforme.</p>
                    <p>Si vous avez des idées ou si vous rencontrez des problèmes, n’hésitez pas à cliquer sur le bouton ci-dessous pour m’envoyer un email. J’ai hâte de vous lire !</p>
                    <p> <em> Afin de me contacter, envoyez-moi un mail à travers ce bouton : </em> <button style={{padding : '10px', borderRadius: '15px', background: 'turquoise'}} onClick={() => window.location = 'mailto:kavinesteves@gmail.com'}>Contactez-moi</button> </p>
                    <div>
                        <em> Ou par X : </em>
                        <a href="https://twitter.com/messages/compose?recipient_id=2469732720" className="twitter-dm-button"
                           data-screen-name="@furni">
                            Twitter / X Direct Message
                        </a>
                    </div>
                    <p>
                        <em> Afin de m'offrir un pourboire, cliquez sur ce bouton : </em>
                        <a id='donation'
                           href='https://ko-fi.com/Y8Y219BE1W'
                           target='_blank'
                           rel='noreferrer'>
                            <img style={{height:'36px', verticalAlign: 'middle'}} src='https://storage.ko-fi.com/cdn/kofi2.png?v=6'  border='0' alt='Buy Me a Coffee at ko-fi.com' />
                        </a>
                    </p>
                </div>
                <div className='dataPolicy' style={{borderTop : '1px solid darkgrey'}}>
                    <h2> Politique des données </h2>
                    <p>Pour garantir votre sécurité et vous informer en cas de gain, seule votre adresse e-mail sera conservée lorsque vous jouez en mode "Record".</p>
                    <p>De plus, afin d'analyser la fréquentation du site, certaines données supplémentaires seront enregistrées.</p>
                </div>
            </div>
        )
    }

    else if(props.lang === 1) {
        return (
            <div className='informations'>
                <div className='about'>
                    <h2>About me</h2>
                    <p>Hello everyone! I hope you’re enjoying this Pokémon quiz and several functionalities.</p>
                    <p>As the creator and maintainer of this site, I’ve been passionate about the Pokémon world since my childhood.</p>
                    <p>I’ve cherished countless memories with Pokémon games on the Nintendo DS, collected an array of trading cards, and spent many hours playing Pokémon GO, Pokémon Unite & Pokemon TCG Pocket.</p>
                    <p>This website is my way of bringing together a community of fans who can challenge themselves, guess many Pokémon as possible and apply their knowledge about Pokémon.</p>
                    <p>To ensure a seamless and enjoyable experience, I’ve decided this website will remain free of ads.</p>
                    <p>Currently, this is the very first version of the site. I’d greatly appreciate your input—whether it’s recommendations, feedback, feature requests, or reporting issues. Your support will help make this platform even better.</p>
                    <p>If you have suggestions or encounter any problems, feel free to click the button below to send me an email. I’d love to hear from you!</p>
                    <p> <em> To contact me, send me a mail through this button : </em>
                        <button style={{padding : '10px', borderRadius: '15px', background: 'turquoise'}} onClick={() => window.location = 'mailto:kavinesteves@gmail.com'}>Contact Me</button>
                    </p>
                    <div>
                    <em>Or by X :</em>
                        <a href="https://twitter.com/messages/compose?recipient_id=2469732720" className="twitter-dm-button"
                           data-screen-name="@furni">
                            Twitter / X Direct Message
                        </a>
                    </div>
                    <p> <em> To give me a tip, click on this button : </em>
                        <a id='donation' href='https://ko-fi.com/Y8Y219BE1W'
                           target='_blank'
                           rel='noreferrer'>
                            <img style={{height:'36px', verticalAlign: 'middle'}} src='https://storage.ko-fi.com/cdn/kofi2.png?v=6'  border='0' alt='Buy Me a Coffee at ko-fi.com' />
                        </a>
                    </p>
                </div>
                <div className='dataPolicy' style={{borderTop : '1px solid darkgrey'}}>
                    <h2> Data Policy </h2>
                    <p>To ensure your security and notify you in case of a win, only your email address will be stored when you play in "Record" mode.</p>
                    <p>Additionally, to analyze site traffic and for statistical purposes, some additional data will be recorded.</p>
                </div>
            </div>
        )
    }

    else if (props.lang === 2) {
        return (
        <div className='informations'>
            <div className='about'>
                <h2>Über mich</h2>
                <p>Hallo zusammen! Ich hoffe, ihr habt Spaß an diesem Pokémon-Quiz und den verschiedenen Funktionen.</p>                <p>Als Ersteller und Betreiber dieser Seite bin ich seit meiner Kindheit ein großer Fan der Pokémon-Welt.</p>
                <p>Ich habe viele schöne Erinnerungen an Pokémon-Spiele auf der Nintendo DS, habe unzählige Karten gesammelt und viel Zeit mit Pokémon GO, Pokémon Unite & & Pokemon TCG Pocket verbracht.</p>
                <p>Diese Website habe ich ins Leben gerufen, um eine großartige Community zusammenzubringen, die ihr Wissen über Pokémon testen und erweitern kann.</p>
                <p>Um sicherzustellen, dass ihr eine angenehme und ungestörte Erfahrung habt, habe ich entschieden, dass diese Website immer frei von Werbeanzeigen bleiben wird.</p>
                <p>Dies ist die erste Version der Website, und ich freue mich über jede Art von Vorschlägen—sei es Feedback, Ideen für neue Funktionen oder auch Meldungen zu Problemen. Eure Unterstützung hilft, die Plattform zu verbessern.</p>
                <p>Wenn ihr Ideen habt oder auf Probleme stoßt, klickt bitte unten, um mir eine E-Mail zu schicken. Ich freue mich darauf, von euch zu hören!</p>
                <p> <em> Um mich zu kontaktieren, senden Sie mir eine E-Mail über diesen Button: </em>
                    <button style={{padding : '10px', borderRadius: '15px', background: 'turquoise'}} onClick={() => window.location = 'mailto:kavinesteves@gmail.com'}>Kontaktieren Sie mich</button>
                    </p>
                <div>
                <em> Oder über X :</em>
                        <a href="https://twitter.com/messages/compose?recipient_id=2469732720" className="twitter-dm-button"
                           data-screen-name="@furni">
                            Twitter / X Direct Message
                        </a>
                </div>
                <p> <em> Um mir ein Trinkgeld zu geben, klicken Sie auf diesen Button: </em>
                        <a id='donation' href='https://ko-fi.com/Y8Y219BE1W' target='_blank' rel='noreferrer'>
                            <img style={{height: "36px", verticalAlign : "middle"}}
                                 src='https://storage.ko-fi.com/cdn/kofi2.png?v=6' border='0'
                                 alt='Kaufen Sie mir einen Kaffee auf ko-fi.com' />
                        </a>
                </p>
            </div>
            <div className='dataPolicy' style={{borderTop : '1px solid darkgrey'}}>
                <h2>Datenschutzerklärung</h2>
                <p>Um Ihre Sicherheit zu gewährleisten und Sie im Falle eines Gewinns zu benachrichtigen, wird beim Spielen im „Record“-Modus nur Ihre E-Mail-Adresse gespeichert.</p>
                <p>Zusätzlich werden einige weitere Daten zu statistischen Zwecken und zur Analyse des Website-Traffics erfasst.</p>
            </div>
        </div>



    );
    }
}

export default About;