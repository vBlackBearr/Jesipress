import React, { useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModalConfirmation from '../src/modals/ModalConfirmation';
import { DataContext } from "../src/contexts/DataContext";
import { useLoader } from '../src/contexts/LoaderContext';

const ListaPrestamos = ({ navigation }) => {

    const { getAllPrestamos, getObjetoById, deletePrestamoById } = useContext(DataContext);

    const [prestamos, setPrestamos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

    const { showLoader, hideLoader } = useLoader();


    // useEffect(()  

    useEffect(() => {
        cargarPrestamos()
    }, []);

    const cargarPrestamos = () => {
        showLoader();
        getAllPrestamos()
            .then(async (response) => {
                // Crear una copia de los préstamos para trabajar con ellos
                let updatedPrestamos = [...response];
                
                // Array de promesas para obtener los nombres de los objetos
                const promises = updatedPrestamos.map(async (prestamo) => {
                    if (prestamo.objeto_id) {
                        const { nombre } = await getObjetoById(prestamo.objeto_id);
                        prestamo.nombre_objeto = nombre;
                    }
                    return prestamo;
                });
    
                // Esperar a que todas las promesas se resuelvan
                const resolvedPrestamos = await Promise.all(promises);
    
                // Ordenar los préstamos primero por 'devuelto' y luego por 'hora_solicitud'
                resolvedPrestamos.sort((a, b) => {
                    // Ordenar por 'devuelto' (false primero)
                    if (a.devuelto !== b.devuelto) {
                        return a.devuelto - b.devuelto;
                    }
                    // Si 'devuelto' es igual, ordenar por 'hora_solicitud' en orden descendente
                    return new Date(b.hora_solicitud) - new Date(a.hora_solicitud);
                });
    
                // Actualizar el estado con los objetos modificados y ordenados
                setPrestamos(resolvedPrestamos);
            })
            .catch((error) => {
                console.error('Error al obtener la lista de préstamos:', error);
            }).finally(() => {
                hideLoader();
            });
    };
    

    const mostrarModalConfirmation = (prestamo) => {
        setPrestamoSeleccionado(prestamo);
        setModalVisible(true);
    };

    const confirmarEliminacion = () => {
        // Realiza la solicitud de eliminación a tu API utilizando el ID del préstamo seleccionado
        const prestamoId = prestamoSeleccionado.id;
        deletePrestamoById(prestamoId)
            .then(() => {
                // Actualiza la lista de préstamos después de la eliminación
                const nuevosPrestamos = prestamos.filter((p) => p.id !== prestamoId);
                setPrestamos(nuevosPrestamos);
                setPrestamoSeleccionado(null);
                setModalVisible(false);
            })
            .catch((error) => {
                console.error('Error al eliminar el préstamo:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Préstamos</Text>
            <FlatList
                data={prestamos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.prestamoItem}>
                        <Text>Persona: {item.numero_control}</Text>
                        <Text>Objeto: {item.nombre_objeto}</Text>
                        <Text>Hora Solicitud: {item.hora_solicitud}</Text>

                        {!item.devuelto ? (
                            <Text style={{ color: 'orange' }}>En Prestamo</Text>
                        ) : (
                            <Text style={{ color: 'green' }}>Devuelto</Text>

                        )}

                        <TouchableOpacity onPress={() => mostrarModalConfirmation(item)}>
                            <Text style={styles.botonEliminar}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <ModalConfirmation
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onConfirm={confirmarEliminacion}
                title={"Confirmar Eliminación"}
                text={"¿Estás seguro de que deseas eliminar este préstamo?"}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    prestamoItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 16,
        marginBottom: 12,
    },
    botonEliminar: {
        color: 'red',
        marginTop: 8,
    },
});

export default ListaPrestamos;
