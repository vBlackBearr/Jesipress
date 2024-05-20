import React, {useState} from 'react';
import {Text, View, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import Modal from 'react-native-modal';
import {createPrestamo} from "../src/REST_METHODS";
const {format} = require('date-fns');

export default function CameraScreen2({navigation, route}) {
    const [scanned, setScanned] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleCancel = () => {
        toggleModal();
    };
    const handleAccept = () => {
        request
        toggleModal();
    };
    

    const request = ({dataBarCode}) => {
        const fechaHoraActual = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const data = {
            objeto_id: route.params.idObjeto,
            numero_control: dataBarCode,
            hora_solicitud: fechaHoraActual,
            devluelto: false
        }
        createPrestamo(data).then(r => () => {
        });
    };

    const handleBarCodeScanned = ({type, data}) => {
            if (type === "org.iso.Code39") {
                setScanned(true);
                request({dataBarCode: data});
                alert(`Registro Exitoso con el numero de control: ${data}`);
                navigation.navigate('HomeScreen');
            } else {
                alert(`El codigo no pertenece a una credencial.`);
            }
        setScanned(true);
    };

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            <Modal isVisible={isModalVisible}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Este es un mensaje emergente.</Text>
                    <TouchableOpacity onPress={handleAccept}>
                        <Text>Aceptar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancel}>
                        <Text>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            {scanned && <Button title={'Da click para volver a escanear'} onPress={() => setScanned(false)}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});
