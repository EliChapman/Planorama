import React from 'react';
import useWindowDimensions from '../Hooks/useWindowDimensions'

import logoDark from '../../assets/logo-name-dark.svg'


import './PhotoStream.css'

const PhotoStream = () => {

    const weightedRand = function(spec) { var i, sum=0, r=Math.random(); for(i in spec) { sum += spec[i]; if (r <= sum) return i;}}
    const images = []
    const photoCount = useWindowDimensions().width / 34

    var n = 0

    while (n < Math.ceil(photoCount)) {
        var span = weightedRand({1:0.6, 2:0.25, 3:0.15});
        var url = "https://unsplash.it/" + (span * 100) * 2 + "/" + (span * 100) * 2 + "/?random&amp;time=" + n++;

        images.push(
            <div
                style = {{backgroundImage: 'url(' + url + ')'}}
                className = {'photo-card span-' + span + ' c-' + weightedRand({ 1: 0.2, 2: 0.2, 3: 0.2, 4: 0.2, 5: 0.2 })}
                key = {n}
                size = {span} 
            />
        )
    }

    return (
        <div className='grid-container'>
            <div className='overlay'>
                <img src={logoDark} alt='Planorama' className='main-logo'/>
            </div>
            <div className='grid'>
                {images}
            </div>
        </div>
    );
}

export default PhotoStream;