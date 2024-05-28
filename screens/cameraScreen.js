import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Icon } from 'react-native-elements';

export default function CameraScreen({ handleBarCodeScanned: externalHandleBarCodeScanned, navigation, barcodeTypes = [] }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const [mensaje, setMensaje] = useState('');

  const [flashState, setFlashState] = useState(false)

  const [permission, requestPermission] = useCameraPermissions();

  //Se debe de mandar en los parametros forsozamente el metodo
  // const { handleBarCodeScanned } = route.params

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
    externalHandleBarCodeScanned({ data })
  };

  const toogleFlashState = () => {
    flashState ? setFlashState(false) : setFlashState(true)
  }

  return (
    <View style={styles.container}>

      <CameraView style={styles.cameraView} enableTorch={flashState}
      // barcodeType
        barcodeScannerSettings={{
          barcodeTypes:  [...barcodeTypes] ,
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
            <Text style={{ fontSize: 30, color: 'white' }}>Escanea {barcodeTypes.includes("qr") ? "el Objeto" : "la Credencial"}</Text>
          </View>
          {barcodeTypes.includes("qr") ? (
            <Icon
              name='scan-outline'
              type='ionicon'
              color='rgba(128,128,128, 0.8)'
              size={400}

            />
          ) : (
            <View style={{height: 350, display: 'flex', justifyContent: "center", alignItems: "center"}}>
              <View style={{ borderColor: 'rgba(128,128,128, 0.8)', borderRadius: 10, width: '90%', height: 100, borderWidth: 5 }}>

              </View>
            </View>
          )}


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
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(62, 62, 62, 0.7)',
  },
});
