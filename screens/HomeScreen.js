import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ObjetosScreen } from "./ObjetosScreen";
import FormularioObjeto from "./FormularioObjeto";
import PrestamosScreen from "./PrestamosScreen";
import CameraCodeRegisterScreen from "./CameraCodeRegisterScreen";
import ScanObjeto from './ScanObjeto';
import ScanCredencial from './ScanCredencial';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Icon } from 'react-native-elements';

const Tab = createMaterialBottomTabNavigator();

const HomeScreen = ({ navigation }) => {

    return (

        <Tab.Navigator>
            <Tab.Screen name="ObjetosScreen" component={ObjetosScreen} options={{
                title: "Objetos",
                tabBarIcon: ({ color }) => (
                    <Icon name="projector" type="material-community" />
                ),
            }} />
            <Tab.Screen name="PrestamosScreen" component={PrestamosScreen} options={{
                title: "Registro",
                tabBarIcon: ({ color }) => (
                    <Icon name="calendar-text" type="material-community" />
                )
            }} />
            <Tab.Screen name="ScanObjeto" component={ScanObjeto} options={{
                title: "Entrada/Salida",
                tabBarIcon: ({ color }) => (
                    <Icon name="qrcode-scan" type="material-community" />
                )
            }} />
        </Tab.Navigator>
    );
};

const Stack = createStackNavigator();

const App = () => {

    return (

        <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: "Jesipress", headerStyle: { backgroundColor: 'papayawhip' } }} />
                <Stack.Screen name="FormularioObjeto" component={FormularioObjeto} />
                <Stack.Screen name="ScanCredencial" component={ScanCredencial} options={{ headerShown: false }} />
                <Stack.Screen name="CameraCodeRegisterScreen" component={CameraCodeRegisterScreen} />
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
