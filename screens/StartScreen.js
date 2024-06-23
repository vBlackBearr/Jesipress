import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import React from 'react';
import EfectoEscritura from '../src/extras/EfectoEscritura'

function StartScreen({ navigation }) {



    return (
        <View style={styles.container}>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <EfectoEscritura text="Jesipress" bucle={false} fontSize={80}/>
                <View style={styles.divider}></View>
                <EfectoEscritura text="Jefatura de Sistemas Computacionales" bucle={false} fontSize={20} fontColor='black'/>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen')}>
                <Text style={styles.buttonText}>Empezar</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:
            'space-around',
        alignItems:
            'center',
    },
    button: {
        paddingVertical: 20,
        paddingHorizontal: 90,
        backgroundColor: '#915400',
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        textAlign:
            'center',
        textAlignVertical: 'center',
        fontSize:
            15,
    },
    divider: {
        width: 200,
        height: 2,
        backgroundColor: '#C09200',
        marginBottom: 20,
    }
})

export default StartScreen;