import React from 'react';
import { SocialIcon } from 'react-social-icons/component';
import 'react-social-icons/facebook'
import 'react-social-icons/x'
import 'react-social-icons/whatsapp'
import {getLocalizedString} from "./utils/TranslationData";
import {Helmet} from "react-helmet";

const ShareSocialMedia = ({lang, nbPokemonUser, nbPokemon, contentKey}) => {

    const websiteUrl = "www.pokerumble.com"

    const langName = lang === 0 ? "fr" : lang === 1 ? "en" : "de";

    return (
        <div className='social-media'>
            <p> <strong> {getLocalizedString(lang, "sharing")} </strong> </p>

            <SocialIcon href={`https://www.facebook.com/sharer/sharer.php?u=${websiteUrl}/${langName}/${nbPokemonUser}`} network="facebook" style={{margin : '10px'}}/>
            <SocialIcon href={`https://twitter.com/intent/tweet?text=${getLocalizedString(lang, contentKey, {pokemonNbUser : nbPokemonUser, pokemonNb : nbPokemon})}&url=${websiteUrl}`} network="x" style={{margin : '5px'}}/>
            <SocialIcon href={`https://api.whatsapp.com/send?text=${getLocalizedString(lang, contentKey, {pokemonNbUser : nbPokemonUser, pokemonNb : nbPokemon})} → www.pokerumble.com`} network="whatsapp" style={{margin : '10px'}}/>

            <Helmet>
                <meta property="og:title"
                      content={
                          getLocalizedString(lang, contentKey, {stats: nbPokemonUser / nbPokemon})}
                      data-react-helmet='true'/>
                <meta property="og:description"
                      content={getLocalizedString(lang, 'metaDescription')}
                      data-react-helmet='true'/>
            </Helmet>


        </div>
    )
}

export default ShareSocialMedia;