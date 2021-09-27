// @ts-ignore
import React, {useEffect, useState} from 'react'

import {Button, Icon, Item} from 'semantic-ui-react'

import abstract_modern_image from '../bcgs/abstract_bcg.png'
import beach_hide_out_image from '../bcgs/beach_bcg.jpg'
// import bass_girl_image from '../bcgs/dnb_hottie_bcg.jpg'
// import marbles_image from '../bcgs/marbles_bcg.jpg'
// import ranaissance from '../bcgs/modern_renaissance.gif'
// import decadence from '../bcgs/decadence.gif'
// import blitmaps from '../bcgs/blitmap_bcg.png'
import desert_sunset from '../bcgs/desert_sunset.jpg'
import splash from '../bcgs/splash.jpeg'
import trees from '../bcgs/tress_and_water.jpg'
import mountains from '../bcgs/mountains.jpg'
import earth from '../bcgs/earth.jpg'
import night from '../bcgs/night.jpg'
import lake from '../bcgs/lake.jpg'
import wave from '../bcgs/wave.jpg'
import stars from '../bcgs/stars.jpg'
import cloud from '../bcgs/clouds.jpg'
import metaverse from '../bcgs/metaverse.jpeg'

import {
    getRuntimeSettingsFromStore,
    saveRuntimeSettingsToStore
} from '../../features/local-store/local-store'

export const backgrounds = [
    {caption:'Metaverse by xxx', url:metaverse, linkUrl:'https://knownorigin.io/'},
    {caption:'Abstract Modern by xxx', url:abstract_modern_image, linkUrl:'https://knownorigin.io/'},
    {caption:'Beach Hideout by xxx', url:beach_hide_out_image, linkUrl:'https://knownorigin.io/'},
    {caption:'Splash by xxx', url:splash, linkUrl:'https://knownorigin.io/'},
    {caption:'Desert Sunset by xxx', url:desert_sunset, linkUrl:'https://knownorigin.io/'},
    {caption:'Trees and Water by xxx', url:trees, linkUrl:'https://knownorigin.io/'},
    {caption:'Mountains by xxx', url:mountains, linkUrl:'https://knownorigin.io/'},
    {caption:'Earth by xxx', url:earth, linkUrl:'https://knownorigin.io/'},
    {caption:'Night by xxx', url:night, linkUrl:'https://knownorigin.io/'},
    {caption:'Lake by xxx', url:lake, linkUrl:'https://knownorigin.io/'},
    {caption:'Wave by xxx', url:wave, linkUrl:'https://knownorigin.io/'},
    {caption:'Stars by xxx', url:stars, linkUrl:'https://knownorigin.io/'},
    {caption:'Clouds by xxx', url:cloud, linkUrl:'https://knownorigin.io/'},
]

interface BackgroundSelectorProps {
    setBackgroundUrl: (url: string) => void
}

function BackgroundSelector(props: BackgroundSelectorProps) {

    // todo: read index from storage
    const [backgroundIndex, setBackgroundIndex] = useState(0)
    const background = backgrounds[backgroundIndex]

    function displayNextBackground() {
        let idx = backgroundIndex + 1
        if (idx >= backgrounds.length) {
            idx = 0
        }
        setBackgroundIndex(idx)
        saveRuntimeSettingsToStore({background_idx:idx})
        console.log("setting bcg " + idx + ", url: " + backgrounds[idx].url)
    }

    function displayPreviousBackground() {
        let idx = backgroundIndex - 1
        if (idx <= 0) {
            idx = backgrounds.length - 1
        }
        setBackgroundIndex(idx)
        saveRuntimeSettingsToStore({background_idx:idx})
        console.log("setting bcg " + idx + ", url: " + backgrounds[idx].url)
    }

    useEffect( () => {
        props.setBackgroundUrl(backgrounds[backgroundIndex].url)
    }, [props, backgroundIndex])

    useEffect( () => {
        const settings = getRuntimeSettingsFromStore()

        if (!backgrounds[settings.background_idx]) {
            setBackgroundIndex(0)
        } else {
            setBackgroundIndex(settings.background_idx)
        }
    }, [props])

    return (
        <Item style={{
            display: 'flex',
            alignItem: 'center',
            height: '40px',
            left: '0px',
            right: '0px',
            position: 'fixed',
            bottom: '0',
            zIndex: '10'}}>
            <Button style={{width:'32px', background:'transparent'}} as='a' onClick={(_) => displayPreviousBackground()}>
                <Icon style={{color: 'white', textShadow:'1px 1px #111111'}} name='chevron left'/>
            </Button>
            <span style={{fontSize: 'larger', fontWeight:'bolder', marginTop:'8px', color: 'white', textShadow:'1px 1px #111111'}}>NFT art <a
                style={{color: 'white', textDecoration: 'underline'}} href={background.linkUrl}
                target='_blank' rel='noopener noreferrer'>{background.caption}</a></span>
            <Button style={{width:'32px', marginLeft:'-14px', background:'transparent'}} as='a' onClick={(_) => displayNextBackground()}>
                <Icon style={{color: 'white', marginTop:'2px', textShadow:'1px 1px #111111'}} name='chevron right'/>
            </Button>
        </Item>)
}

export default BackgroundSelector
