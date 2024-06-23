import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import useInterval from '../utilities/useInterval';
import { useFonts } from 'expo-font';
function EfectoEscritura({ text, bucle = false, fontSize = 80, fontColor = "#C09200" }) {

    const [fontsLoaded] = useFonts({
        'Baskerville Old Face': require('../../assets/fonts/baskerville-old-face.ttf'),
    });

    const [index, setIndex] = useState(0);
    const [vamosPatras, setVamosPatras] = useState(false);

    useEffect(() => {
        setIndex(0);
        setVamosPatras(false);
    }, [bucle])

    useInterval(() => {
        if (index < text.length && !vamosPatras) {
            setIndex(prev => prev + 1);
            setIndex(index + 1);
        } else if(bucle) {
            setVamosPatras(true);
            setIndex(prev => prev - 1);
            if(index === 1) {
                setVamosPatras(false);
            }
        }
    }, 60)

    return (
        <>
            <View style={{}}>
                <Text style={{ color: fontColor, fontSize: fontSize, fontFamily: "Baskerville Old Face", fontWeight: "bold", height: 70, marginBottom: 50}}>{text.slice(0, index)}</Text>
            </View>
        </>
    )
}

export default EfectoEscritura; 