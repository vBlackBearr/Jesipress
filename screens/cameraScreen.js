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

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
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
        barcodeScannerSettings={{
          barcodeTypes: [...barcodeTypes],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>

        {!barcodeTypes.includes("qr") ? (
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
        ) : (<></>)}
        <View style={{
          width: '100%',
          height: (barcodeTypes.includes("qr") ? "70%" : "50%"),
          justifyContent: "space-between"
        }}>
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
            <View style={{ height: 350, display: 'flex', justifyContent: "center", alignItems: "center" }}>
              <View style={{ borderColor: 'rgba(128,128,128, 0.8)', borderRadius: 10, width: '90%', height: 100, borderWidth: 5 }}>

              </View>
            </View>
          )}


        </View>
        {scanned && <Button title={'Da click para volver a escanear'} onPress={() => setScanned(false)} />}
        <View style={styles.viewInferior}>
          <View style={styles.flashView} onPress={() => { toogleFlashState() }}>
            <Icon
              name={flashState ? 'flashlight-off' : 'flashlight'}
              type='material-community'
              color='rgba(255,255,255, 0.3)'
              size={50}
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
    alignItems: 'center'
  },
  cameraView: {
    height: '100%',
    width: '100%',
    top: '1px',
    position: 'absolute',
    display: 'flex',
    justifyContent: "space-between"
  },
  viewSuperior: {
    width: '100%',
    height: '25%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  viewInferior: {
    width: '100%',
    height: '25%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  flashView: {
    height: 80,
    width: 80,
    backgroundColor: 'rgba(50,50,50, 0.6)',
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
