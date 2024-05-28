import axios from 'axios';
import { format } from "date-fns";
import { collection, getDocs, getDoc, updateDoc, doc, deleteDoc, addDoc, setDoc, query, where } from 'firebase/firestore/lite';
import db from '../database/firebase'

/*
*      ************************
*         METODOS DE OBJETOS
*      ************************
* */
export const getAllObjetos = async () => {
    try {
        const objetosCol = collection(db, 'objetos');
        const citySnapshot = await getDocs(objetosCol);
        const cityList = citySnapshot.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id;
            return data;
        });
        return cityList;
    } catch (error) {
        console.error('Error en la solicitud GET de objetos:', error);
        throw error;
    }
};

export const getObjetoByCode = async (codigo) => {
    try {
        const objetosCol = collection(db, 'objetos');
        const querySnapshot = await getDocs(query(objetosCol, where('codigo', '==', codigo)));
        if (querySnapshot.empty) {
            throw new Error('No se encontró ningún objeto con el código proporcionado.');
        }

        const objeto = querySnapshot.docs[0].data();
        // Agregar el ID al objeto
        objeto.id = querySnapshot.docs[0].id;

        return objeto;
    } catch (error) {
        console.error('Error en la solicitud GET de objeto por código:', error);
        throw error;
    }
};


export const getObjetoById  = async (objetoId): Promise<object> => {
    try {
        const objetoRef = doc(db, 'objetos', objetoId);
        const objetoDoc = await getDoc(objetoRef);

        if (objetoDoc.exists()) {
            const objetoData = objetoDoc.data();
            // Incluir el ID dentro del objeto
            objetoData.id = objetoDoc.id;
            return objetoData;
        } else {
            console.error('No existe ningún objeto con el ID proporcionado:', objetoId);
            return null;
        }
    } catch (error) {
        console.error('Error en la solicitud GET de objeto por ID:', error);
        throw error;
    }
};


export const createObjeto = async (objetoData) => {
    try {
        const objetoRef = await addDoc(collection(db, 'objetos'), objetoData);
        return objetoRef.id;
    } catch (error) {
        console.error('Error al crear un nuevo objeto:', error);
        throw error;
    }
};


export const updateObjetoById = async (objetoId, objetoData) => {
    try {
        const objetoRef = doc(db, 'objetos', objetoId);
        await setDoc(objetoRef, objetoData, { merge: true });
        return true; // Indica que la actualización se realizó con éxito
    } catch (error) {
        console.error('Error al actualizar el objeto:', error);
        throw error;
    }
};



// export const setObjetoDevuelto = async (objetoId) => {
//     try {
//         const response = await axios.put(`${OBJETOS_API_BASE_URL}/${objetoId}`, datosActualizados);
//         return response.data;
//     } catch (error) {
//         console.error('Error en la solicitud PUT de objeto por ID:', error);
//         throw error;
//     }
// };


export const deleteObjetoById = async (objetoId) => {
    try {
        const objetoRef = doc(db, 'objetos', objetoId);
        await deleteDoc(objetoRef);
        return true;
    } catch (error) {
        console.error('Error al eliminar el objeto:', error);
        throw error;
    }
};


/*
*      ***************************
*         METODOS DE PRESTAMOS
*      ***************************
* */
export const getAllPrestamos = async () => {
    try {
        const prestamosCol = collection(db, 'prestamos');
        let prestamosSnapshot;

        prestamosSnapshot = await getDocs(prestamosCol);

        const prestamosList = prestamosSnapshot.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id;
            return data;
        });

        return prestamosList;
    } catch (error) {
        console.error('Error en la solicitud GET de préstamos:', error);
        throw error;
    }
};

export const getPrestamoByObjectIdWhereDevueltoIsFalse = async (object_id) => {
    try {
        const prestamosCol = collection(db, 'prestamos');
        let prestamosSnapshot;

        const q = query(prestamosCol, where('objeto_id', '==', object_id), where('devluelto', '==', false));

        prestamosSnapshot = await getDocs(q);

        const prestamosList = prestamosSnapshot.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id;
            return data;
        });

        return prestamosList;
    } catch (error) {
        console.error('Error en la solicitud GET de préstamos:', error);
        throw error;
    }
};





export const getPrestamoById = async (prestamoId) => {
    try {
        const prestamoRef = doc(db, 'prestamos', prestamoId);
        const prestamoDoc = await getDoc(prestamoRef);

        if (prestamoDoc.exists()) {
            const prestamoData = prestamoDoc.data();
            prestamoData.id = prestamoDoc.id;
            return prestamoData;
        } else {
            console.error('No existe ningún préstamo con el ID proporcionado:', prestamoId);
            return null;
        }
    } catch (error) {
        console.error('Error en la solicitud GET de préstamo por ID:', error);
        throw error;
    }
};


export const createPrestamo = async (prestamoData) => {
    try {
        const prestamoRef = await addDoc(collection(db, 'prestamos'), prestamoData);
        const objetoId = prestamoData.objeto_id;
        await updateObjetoEstado(objetoId, false); // Llamar a la función para actualizar el estado del objeto
        return prestamoRef.id;
    } catch (error) {
        console.error('Error al crear un nuevo préstamo:', error);
        throw error;
    }
};

// Función para actualizar el estado del objeto
const updateObjetoEstado = async (objetoId, estado) => {
    try {
        const objetoRef = doc(db, 'objetos', objetoId);
        await updateDoc(objetoRef, { estado: estado });
    } catch (error) {
        console.error('Error al actualizar el estado del objeto:', error);
        throw error;
    }
};



export const updatePrestamoById = async (prestamoId, prestamoData) => {
    try {
        const prestamoRef = doc(db, 'prestamos', prestamoId);
        await setDoc(prestamoRef, prestamoData, { merge: true });
        return true; // Indica que la actualización se realizó con éxito
    } catch (error) {
        console.error('Error al actualizar el préstamo:', error);
        throw error;
    }
};

// export const registroDevolucionPrestamo = async (codigoObj, data) => {
//     try {
//         const response = await axios.put(`${PRESTAMOS_API_BASE_URL}/devolucion/${codigoObj}`, data);
//         return response.data;
//     } catch (error) {
//         console.error('Error en la solicitud PUT de devolucion de préstamo:', error);
//         throw error;
//     }
// }

/*
export const llegadaPrestamoById = async (objetoId ) => {
    try {
        getObjetoByCode(objetoId).then((response) => {
            getPrestamoById(response.indice_on_prestamo).then((response2) => {
                response2.hora_devolucion = Date();
                response2.hora_devolucion = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
                updatePrestamoById(response2.id,response2).then(() => {
                    response.estado = 1;
                    response.indice_on_prestamo = null;
                    updateObjetoById(response.id, response).then((response3) => {
                    }).catch((error) => {+
                        console.error(error);
                    });
                }).catch((error) => {
                    console.error(error);
                })
            }).catch((error) => {
                console.error(error);
            })

            return response.data;
        }).catch((error) => {

        });

    } catch (error) {
        console.error('Error en la solicitud PUT de préstamo por ID:', error);
        throw error;
    }
};*/

export const deletePrestamoById = async (prestamoId) => {
    try {
        const prestamoRef = doc(db, 'prestamos', prestamoId);
        await deleteDoc(prestamoRef);
        return true; // Indica que la eliminación se realizó con éxito
    } catch (error) {
        console.error('Error al eliminar el préstamo:', error);
        throw error;
    }
};
