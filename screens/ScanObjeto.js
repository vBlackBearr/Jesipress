import { getObjetoByCode, getPrestamoById, updatePrestamoById, updateObjetoById } from "../src/REST_METHODS";
import CameraScreen from "./cameraScreen";


export default function ScanObjeto({ navigation }) {

    const handleBarCodeScanned = ({ data }) => {
        // alert("Codigo: " + data)
        getObjetoByCode(data).then((objeto_data) => {
            //Se valida si el objeto esta disponible o no
            if (objeto_data.estado === true) {

                //Caso en el que el objeto este disponible
                alert(`Objeto disponible, ahora escanea la credencial!`);


                navigation.navigate('ScanCredencial', { idObjeto: objeto_data.id });
            } else {

                //Caso en el que el objeto este prestado y se este devolviendo
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

    return (
        <CameraScreen navigation={navigation} handleBarCodeScanned={handleBarCodeScanned} barcodeTypes={["qr"]} />
    )

}