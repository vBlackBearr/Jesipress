import React, { createContext, useState, useContext } from 'react';
import { View } from 'react-native';
import LottieView from "lottie-react-native";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => {
        setLoading(true);
        console.log('Loader activado');
    };
    const hideLoader = () => {
        setLoading(false);
        console.log('Loader desactivado');
    };

    return (
        <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>

            {loading && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <LottieView
                        source={require("../../assets/animations/loader_animation.json")}
                        style={{ width: "50%", height: "50%" }}
                        autoPlay
                        loop
                        
                    />
                </View>
            )}
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);
