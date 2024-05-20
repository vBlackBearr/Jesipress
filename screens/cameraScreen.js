import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Icon } from 'react-native-elements';
import {
    getPrestamoByObjectIdWhereDevueltoIsFalseFalse,
    getAllPrestamos,
    getObjetoByCode,
    getObjetoById,
    getPrestamoById, registroDevolucionPrestamo,
    updatePrestamoById,
    updateObjetoById
} from "../src/REST_METHODS";
import { where, query } from 'firebase/firestore';

export default function CameraScreen({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [mensaje, setMensaje] = useState('');

    const [flashState, setFlashState] = useState(false)

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);


    const handleBarCodeScanned = ({ type, data }) => {
        getObjetoByCode(data).then((response) => {
            //Caso en el que el objeto este disponible
            if (response.estado === true) {
                alert(`Objeto disponible, ahora escanea la credencial!`);
                navigation.navigate('CameraScreen2', { idObjeto: response.id });
            } else {

                //Caso en el que el objeto este prestado y se este devolviendo

                // const q = query(prestamosCol, where('objeto_id', '==', response.id), where('devluelto', '==', false));
                getPrestamoByObjectIdWhereDevueltoIsFalseFalse(response.id).then((prestamos) => {
                    const obj = getObjetoById(prestamos[0].objeto_id)
                    alert(obj.id)
                    // updateObjetoById(obj.id)

                })


            }
        }).catch((error) => {
            alert(`El objeto no se encuentra registrado!`);
        })
        setScanned(true);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const toogleFlashState = () => {
        flashState?setFlashState(false):setFlashState(true)
    }

    return (
        <View style={styles.container}>

            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.cameraView}
                flashMode= 'on'
            // style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button title={'Da click para volver a escanear'} onPress={() => setScanned(false)} />}
            <View style={styles.flashView} onPress={() => {toogleFlashState()}}>
                {/* <Ionicons name="house" color="#ff0000" size={20} /> */}
                <Icon
                    name={flashState?'flash-off':'flash'}
                    type='ionicon'
                    color='#000'
                    size={50}
                    underlayColor={'#8d8989'}
                    reverse={flashState}
                    onPress={() => {toogleFlashState()}}
                />
            </View>
            

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    cameraView: {
        height: '100%',
        width: '100%',
        top: '1px',
        position: 'absolute'
    },
    flashView: {
        height: 90,
        width: 90,
        backgroundColor: '#8d8989',
        position: 'relative',
        end: 1,
        direction: 'rtl',
        bottom: -300,
        left: -10,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'

    }
});
