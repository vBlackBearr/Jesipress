import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import ModalConfirmation from '../src/ModalConfirmation';
import { deletePrestamoById, getAllPrestamos, getObjetoById } from "../src/REST_METHODS";

const ListaPrestamos = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

    useEffect(() => {
        getAllPrestamos()
            .then(async (response) => {
                // console.log(response);
                setPrestamos(response);

                const updatedPrestamos = [...response]
                const promises = updatedPrestamos.map(async (prestamo) => {
                    if(prestamo.objeto_id){
                        // alert(Object.entries(getObjetoById(prestamo.objeto_id)))
                        // prestamo.nombre_objeto = await getObjetoById(prestamo.objeto_id)
                        const {nombre} = await getObjetoById(prestamo.objeto_id)
                        prestamo.nombre_objeto = nombre
                    }
                    return prestamo
                })

                // Esperar a que todas las promesas se resuelvan
                const resolvedPrestamos = await Promise.all(promises);

                // Actualizar el estado con los objetos modificados
                setPrestamos(resolvedPrestamos);    
            })
            .catch((error) => {
                console.error('Error al obtener la lista de préstamos:', error);
            });
    }, []);

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
