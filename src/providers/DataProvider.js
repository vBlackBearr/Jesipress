import { collection, getDocs, getDoc, updateDoc, doc, deleteDoc, addDoc, setDoc, query, where } from 'firebase/firestore/lite';
import db from '../database/firebase'
import { createContext, useState, useEffect, useContext } from 'react';


export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [objetos, setObjetos] = useState([]);
    const [prestamos, setPrestamos] = useState([]);
    const [mensaje, setMensaje] = useState('');

    // Simular datos iniciales
    useEffect(() => {
        
    }, []);

    /*
*      ************************
*         METODOS DE OBJETOS
*      ************************
* */
    const getAllObjetos = async () => {
        try {
            const objetosCol = collection(db, 'objetos');
            const q = query(objetosCol, where('status', '==', true));
            const querySnapshot = await getDocs(q);
            const objetosList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                data.id = doc.id;
                return data;
            });
            return objetosList;
        } catch (error) {
            console.error('Error en la solicitud GET de objetos:', error);
            throw error;
        }
    };


    const getObjetoByCode = async (codigo) => {
        try {
            const objetosCol = collection(db, 'objetos');
            const q = query(objetosCol, where('codigo', '==', codigo), where('status', '==', true));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log('No existe ningún objeto con el código proporcionado:', codigo);
                return null;
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

    const getObjetoById = async (objetoId) => {
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


    const createObjeto = async (objetoData) => {
        try {
            const objetoRef = await addDoc(collection(db, 'objetos'), objetoData);
            return objetoRef.id;
        } catch (error) {
            console.error('Error al crear un nuevo objeto:', error);
            throw error;
        }
    };


    const updateObjetoById = async (objetoId, objetoData) => {
        try {
            const objetoRef = doc(db, 'objetos', objetoId);
            await setDoc(objetoRef, objetoData, { merge: true });
            return true; // Indica que la actualización se realizó con éxito
        } catch (error) {
            console.error('Error al actualizar el objeto:', error);
            throw error;
        }
    };


    const deleteObjetoById = async (objetoId) => {
        try {
            const objetoRef = doc(db, 'objetos', objetoId);
            await updateDoc(objetoRef, { status: false });
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
    const getAllPrestamos = async () => {
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

    const getPrestamoByObjectIdWhereDevueltoIsFalse = async (object_id) => {
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


    const getPrestamoById = async (prestamoId) => {
        try {
            const prestamoRef = doc(db, "prestamos", prestamoId);
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


    const createPrestamo = async (prestamoData) => {
        try {
            const prestamoRef = await addDoc(collection(db, 'prestamos'), prestamoData);
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



    const updatePrestamoById = async (prestamoId, prestamoData) => {
        try {
            const prestamoRef = doc(db, 'prestamos', prestamoId);
            await setDoc(prestamoRef, prestamoData, { merge: true });
            return true; // Indica que la actualización se realizó con éxito
        } catch (error) {
            console.error('Error al actualizar el préstamo:', error);
            throw error;
        }
    };


    const deletePrestamoById = async (prestamoId) => {
        try {
            const prestamoRef = doc(db, 'prestamos', prestamoId);
            await deleteDoc(prestamoRef);
            return true; // Indica que la eliminación se realizó con éxito
        } catch (error) {
            console.error('Error al eliminar el préstamo:', error);
            throw error;
        }
    };


    const returnPrestamo = async (objeto_data) => {

        //Caso en el que el objeto este prestado y se este devolviendo
        await getPrestamoById(objeto_data.prestamo_id).then(async (prestamo_data) => {

            //Se hace el prestamo.devuelto = true
            const { id: id_prestamo, ...prestamoSinId } = prestamo_data
            const newPrestamo = {
                ...prestamoSinId,
                devuelto: true
            }
            await updatePrestamoById(prestamo_data.id, newPrestamo).then(async () => {

                //Se hace el objeto.estado = true
                objeto_data.estado = true
                const { id: id_objeto, ...objetoSinId } = objeto_data
                // alert(Object.entries(objetoSinId))
                const newObjeto = {
                    ...objetoSinId,
                    prestamo_id: ""
                }
                await updateObjetoById(objeto_data.id, newObjeto).then(() => {

                    //Se termino el proceso de devolucion 
                    alert(`Devolucion exitosa!`);
                    // navigation.navigate('HomeScreen')
                })
            })
        })

    }

    return (
        <DataContext.Provider
            value={{
                objetos,
                prestamos,
                mensaje,
                getAllObjetos,
                getObjetoByCode,
                getObjetoById,
                createObjeto,
                updateObjetoById,
                deleteObjetoById,
                getAllPrestamos,
                getPrestamoByObjectIdWhereDevueltoIsFalse,
                getPrestamoById,
                createPrestamo,
                updatePrestamoById,
                deletePrestamoById,
                returnPrestamo,
                setMensaje
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
