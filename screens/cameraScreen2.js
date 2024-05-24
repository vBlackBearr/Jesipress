import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { CameraView } from 'expo-camera'
import Modal from 'react-native-modal';
import { createPrestamo } from "../src/REST_METHODS";
const { format } = require('date-fns');

export default function CameraScreen2({ navigation, route }) {
    const [scanned, setScanned] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [mensaje, setMensaje] = useState('');

    


    

    const handleBarCodeScanned = ({ type, data }) => {
        
        setScanned(true);
    };

    return (
        <View style={styles.container}>
            {/* <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            /> */}
            <CameraView style={styles.cameraView} enableTorch={flashState}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "code39"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>
                {scanned && <Button title={'Da click para volver a escanear'} onPress={() => setScanned(false)} />}
            </CameraView>
            
            {scanned && <Button title={'Da click para volver a escanear'} onPress={() => setScanned(false)} />}
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
