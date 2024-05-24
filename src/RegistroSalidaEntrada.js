import {
    getPrestamoByObjectIdWhereDevueltoIsFalse,
    getAllPrestamos,
    getObjetoByCode,
    getObjetoById,
    getPrestamoById, registroDevolucionPrestamo,
    updatePrestamoById,
    updateObjetoById
} from "../src/REST_METHODS";
import ScanCode from "./ScanCode";

export default function RegistroSalidaEntrada({ navigation }) {
    ScanCode().then((data) => {
        getObjetoByCode(data).then((response) => {
            
            alert(Object.entries(response))

            // if (response.estado === true) {

            //     //Caso en el que el objeto este disponible
            //     alert(`Objeto disponible, ahora escanea la credencial!`);
            //     navigation.navigate('CameraScreen2', { idObjeto: response.id });
            // } else {

            //     //Caso en el que el objeto este prestado y se este devolviendo
            //     getPrestamoByObjectIdWhereDevueltoIsFalse(response.id).then((prestamos) => {

            //         //Se hace el prestamo.devuelto = true
            //         const { id, ...prestamoSinId } = prestamos[0]
            //         updatePrestamoById(prestamos[0].id, prestamoSinId)

            //         //Se hace el objeto.estado = true
            //         getObjetoById(prestamos[0].objeto_id).then((objeto) => {
            //             objeto.estado = true
            //             const { id, ...objetoSinId } = objeto
            //             updateObjetoById(objeto.id, objetoSinId)
            //         })
            //     })
            // }
        }).catch((error) => {
            alert(`El objeto no se encuentra registrado!`);
        })
    }).finally(() => {
        // navigation.navigate('HomeScreen')
    })
}