import { getObjetoByCode, getObjetoById, updateObjetoById } from "../src/REST_METHODS";
import CameraScreen from "./cameraScreen";
import { createPrestamo } from "../src/REST_METHODS";
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { Text, View, TouchableOpacity } from 'react-native';
const { format } = require('date-fns');

export default function ScanCredencial({ route, navigation }) {

    const [isModalVisible, setModalVisible] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleCancel = () => {
        toggleModal();
    };

    const handleAccept = () => {
        // request
        toggleModal();
    };

    const handleBarCodeScanned = ({ data }) => {

        const fechaHoraActual = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const prestamoData = {
            objeto_id: route.params.idObjeto,
            numero_control: data, //numero de control escaneado de la credencial
            hora_solicitud: fechaHoraActual,
            devuelto: false
        }
        
        //Creamos el prestamo
        createPrestamo(prestamoData).then((prestamo_id) => {
            //Usamos el id del prestamo que se creo para ponerlo en 
            // objeto.prestamo_id del roude.params.idObjeto
            getObjetoById(prestamoData.objeto_id).then((objeto) => {
                const { id, ...objetoSinId} = objeto
                const newObjeto = {
                    ...objetoSinId,
                    prestamo_id: prestamo_id
                }
                updateObjetoById(prestamoData.objeto_id, newObjeto)
            })
        });
        alert(`Registro Exitoso con el numero de control: ${data}`);
        navigation.navigate('HomeScreen');

    }

    return (
        <>
            <CameraScreen navigation={navigation} handleBarCodeScanned={handleBarCodeScanned} barcodeTypes={["code39"]} />
            <Modal isVisible={isModalVisible}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Este es un mensaje emergente.</Text>
                    <TouchableOpacity onPress={handleAccept}>
                        <Text>Aceptar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancel}>
                        <Text>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    )

}