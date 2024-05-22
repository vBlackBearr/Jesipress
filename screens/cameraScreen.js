import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Icon } from 'react-native-elements';
import {
  getPrestamoByObjectIdWhereDevueltoIsFalse,
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

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    getObjetoByCode(data).then((response) => {
      //Caso en el que el objeto este disponible
      if (response.estado === true) {
        alert(`Objeto disponible, ahora escanea la credencial!`);
        navigation.navigate('CameraScreen2', { idObjeto: response.id });
      } else {

        //Caso en el que el objeto este prestado y se este devolviendo
        getPrestamoByObjectIdWhereDevueltoIsFalse(response.id).then((prestamos) => {

          //Se hace el prestamo.devuelto = true
          const { id, ...prestamoSinId } = prestamos[0]
          updatePrestamoById(prestamos[0].id, prestamoSinId)

          //Se hace el objeto.estado = true
          getObjetoById(prestamos[0].objeto_id).then((objeto) => {
            objeto.estado = true
            const { id, ...objetoSinId } = objeto
            updateObjetoById(objeto.id, objetoSinId)
          })
        })


      }
    }).catch((error) => {
      alert(`El objeto no se encuentra registrado!`);
    })

  };

  const toogleFlashState = () => {
    flashState ? setFlashState(false) : setFlashState(true)
  }

  return (
    <View style={styles.container}>

      <CameraView style={styles.cameraView} enableTorch={flashState}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code39"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>

        {scanned && <Button title={'Da click para volver a escanear'} onPress={() => setScanned(false)} />}
        <View style={styles.viewSuperior}>
          <Icon
            name='chevron-back-outline'
            type='ionicon'
            color='#000'
            size={50}
            iconStyle={{ left: -2 }}
            containerStyle={styles.btnRegresar}
            onPress={() => { navigation.navigate('HomeScreen') }}
          />
        </View>
        <View style={styles.viewCentral}>
          <View style={styles.textContainer}>
            <Text style={{ fontSize: 30, color: 'white' }}>Escanea el Objeto</Text>
          </View>
          <Icon
            name='scan-outline'
            type='ionicon'
            color='rgba(128,128,128, 0.8)'
            size={400}

          />

        </View>
        <View style={styles.viewInferior}>
          <View style={styles.flashView} onPress={() => { toogleFlashState() }}>
            <Icon
              name={flashState ? 'flash-off' : 'flash'}
              type='ionicon'
              color='#000'
              size={50}
              underlayColor={'#8d8989'}
              reverse={flashState}
              onPress={() => { toogleFlashState() }}
            />
          </View>
        </View>
      </CameraView>
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
    position: 'absolute',
    display: 'flex',
  },
  viewSuperior: {
    width: '100%',
    height: '25%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  viewCentral: {
    width: '100%',
    height: '50%'
  },
  viewInferior: {
    width: '100%',
    height: '25%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  flashView: {
    height: 90,
    width: 90,
    backgroundColor: '#8d8989',
    position: 'relative',
    end: 1,
    direction: 'rtl',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  btnRegresar: {
    backgroundColor: 'white',
    borderRadius: 50,
    marginTop: 50,
    marginLeft: 20,
  },
  textContainer:{ 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'rgba(62, 62, 62, 0.7)',
   },
});
