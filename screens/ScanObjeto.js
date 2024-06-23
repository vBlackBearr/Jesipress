import { useEffect, useContext } from "react";
import { DataContext } from "../src/providers/DataProvider";
import CameraScreen from "./cameraScreen";
import ObjectModal from "../src/modals/ObjectModal";
import { useState } from 'react'


export default function ScanObjeto({ navigation }) {

    const { getObjetoByCode } = useContext(DataContext);

    const [modalVisibility, setModalVisibility] = useState(false)
    const [scannedObject, setScannedObject] = useState({})

    const handleBarCodeScanned = ({ data }) => {
        getObjetoByCode(data).then((objeto_data) => {

            if (objeto_data != null) {
                setScannedObject(objeto_data)
                setModalVisibility(true)
            } else {
                alert(`Objeto no encontrado!`);
            }

        }).catch((error) => {
            alert(`Error obteniendo objeto por codigo!`);
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
