import { useEffect } from "react";
import { getObjetoByCode, getPrestamoById, updatePrestamoById, updateObjetoById, returnPrestamo } from "../src/restMethods";
import CameraScreen from "./cameraScreen";
import ObjectModal from "../src/modals/ObjectModal";
import { useState } from 'react'


export default function ScanObjeto({ navigation }) {

    const [modalVisibility, setModalVisibility] = useState(false)
    const [scannedObject, setScannedObject] = useState({})

    const handleBarCodeScanned = ({ data }) => {
        getObjetoByCode(data).then((objeto_data) => {
            setScannedObject(objeto_data)
            //Se valida si el objeto esta disponible o no
            if (objeto_data.estado === true) {

                setModalVisibility(true)
                // setScannedObject(objeto)

                //Caso en el que el objeto este disponible se manda a la pantalla de escanear 
                // alert(`Objeto disponible, ahora escanea la credencial!`);


                // navigation.navigate('ScanCredencial', { idObjeto: objeto_data.id });
            } else {
                returnPrestamo(objeto_data).catch((error) => {
                    alert(`El objeto no se encuentra registrado!`);
                })
            }
        })
    }


    const handlePrestar = () => {
        navigation.navigate('ScanCredencial', { idObjeto: scannedObject.id });
        setModalVisibility(false)
    }

    return (
        <>
            <CameraScreen navigation={navigation} handleBarCodeScanned={handleBarCodeScanned} barcodeTypes={["qr"]} />
            <ObjectModal visible={modalVisibility} object={scannedObject} handleClose={() => setModalVisibility(false)} navigation={navigation} />
        </>
    )

}
