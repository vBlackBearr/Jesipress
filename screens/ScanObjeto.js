import { useEffect } from "react";
import { getObjetoByCode, getPrestamoById, updatePrestamoById, updateObjetoById } from "../src/restMethods";
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

                //Caso en el que el objeto este prestado y se este devolviendo
                // alert(objeto_data.prestamo_id + "l")
                getPrestamoById(objeto_data.prestamo_id).then((prestamo_data) => {

                    //Se hace el prestamo.devuelto = true
                    const { id: id_prestamo, ...prestamoSinId } = prestamo_data
                    const newPrestamo = {
                        ...prestamoSinId,
                        devuelto: true
                    }
                    updatePrestamoById(prestamo_data.id, newPrestamo).then(() => {

                        //Se hace el objeto.estado = true
                        objeto_data.estado = true
                        const { id: id_objeto, ...objetoSinId } = objeto_data
                        // alert(Object.entries(objetoSinId))
                        const newObjeto = {
                            ...objetoSinId,
                            prestamo_id: ""
                        }
                        updateObjetoById(objeto_data.id, newObjeto).then(() => {

                            //Se termino el proceso de devolucion 
                            alert(`Devolucion exitosa!`);
                            navigation.navigate('HomeScreen')
                        })
                    })
                })
            }
        }).catch((error) => {
            alert(`El objeto no se encuentra registrado!`);
        })
    }

    const handlePrestar = () => {
        navigation.navigate('ScanCredencial', { idObjeto: scannedObject.id });
        setModalVisibility(false)
    }

    return (
        <>
            <CameraScreen navigation={navigation} handleBarCodeScanned={handleBarCodeScanned} barcodeTypes={["qr"]} />
            <ObjectModal visible={modalVisibility} object={scannedObject} handleCancel={() => setModalVisibility(false)} handlePrestar={handlePrestar} />
        </>
    )

}