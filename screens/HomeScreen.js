import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CameraScreen from "./cameraScreen";
import CameraScreen2 from "./cameraScreen2";
import {ObjetosScreen} from "./ObjetosScreen";
import FormularioObjeto from "./FormularioObjeto";
import PrestamosScreen from "./PrestamosScreen";
import CameraCodeRegisterScreen from "./CameraCodeRegisterScreen";

const HomeScreen = ({navigation}) => {

    return (<View style={styles.container}>
        <TouchableOpacity
            style={styles.bigButton}
            onPress={() => navigation.navigate('CameraScreen')}
        >
            <Text style={styles.buttonText}>Escanear Objeto</Text>
        </TouchableOpacity>
        <View style={styles.smallButtonsContainer}>
            <TouchableOpacity
                style={styles.smallButton}
                onPress={() => navigation.navigate('ObjetosScreen')}
            >
                <Text style={styles.buttonText}>Objetos</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.smallButton}
                onPress={() => navigation.navigate('PrestamosScreen')}
            >
                <Text style={styles.buttonText}>Historial de prestamos</Text>
            </TouchableOpacity>
        </View>
    </View>);
};


const Stack = createStackNavigator();

const App = () => {


    return (

        <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen name="HomeScreen" component={HomeScreen}/>
                <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false}}/>
                <Stack.Screen name="CameraScreen2" component={CameraScreen2}/>
                <Stack.Screen name="ObjetosScreen" component={ObjetosScreen}/>
                <Stack.Screen name="PrestamosScreen" component={PrestamosScreen}/>
                <Stack.Screen name="FormularioObjeto" component={FormularioObjeto}/>
                <Stack.Screen name="CameraCodeRegisterScreen" component={CameraCodeRegisterScreen}/>
            </Stack.Navigator>
        </NavigationContainer>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:
            'center',
        alignItems:
            'center',
    }
    ,
    bigButton: {
        backgroundColor: 'blue',
        padding:
            70,
        borderRadius:
            10,
        marginBottom:
            30,
    }
    ,
    smallButtonsContainer: {
        flexDirection: 'row',
        marginLeft: 10
    }
    ,
    smallButton: {
        flex: 1,
        backgroundColor:
            'green',
        padding:
            10,
        borderRadius:
            5,
        marginRight:
            11,
    }
    ,
    buttonText: {
        color: 'white',
        textAlign:
            'center',
        textAlignVertical: 'center',
        fontSize:
            20,
    }
    ,

    pantallaContainer: {
        flex: 1,
        justifyContent:
            'center',
        alignItems:
            'center',
    }
    ,
});

export default App;
