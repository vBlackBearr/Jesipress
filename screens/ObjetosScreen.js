import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteObjetoById, getAllObjetos, getObjetoById } from "../src/REST_METHODS";
import { FAB } from 'react-native-paper';

export const ObjetosScreen = ({ navigation }) => {
    const [objetos, setObjetos] = useState([]);
    const [mensaje, setMensaje] = useState('');



    const cargarObjetos = () => {
        getAllObjetos()
            .then(async (response) => {
                // Actualizar el estado con los objetos iniciales
                setObjetos(response);

                // Crear una copia de los objetos para trabajar con ella
                let updatedObjetos = [...response];

                // Array de promesas para esperar todas las llamadas a getPrestamoById
                const promises = updatedObjetos.map(async (objeto) => {
                    if (!objeto.estado) {
                        // alert(objeto.prestamo_id);

                        // Verificar si el objeto ya tiene los datos del préstamo
                        const prestamo = await getPrestamoById(objeto.prestamo_id);

                        if (!updatedObjetos.some(item => item.numero_control === prestamo.numero_control && item.hora_solicitud === prestamo.hora_solicitud)) {
                            // Actualizar el objeto con los datos del préstamo
                            objeto.numero_control = prestamo.numero_control;
                            objeto.hora_solicitud = prestamo.hora_solicitud;
                        }
                    }
                    return objeto;
                });

                // Esperar a que todas las promesas se resuelvan
                const resolvedObjetos = await Promise.all(promises);

                // Actualizar el estado con los objetos modificados
                setObjetos(resolvedObjetos);
            })
            .catch(() => {
                console.log('Error obteniendo todos los objetos');
            });
    };

    useEffect(() => {
        cargarObjetos();
    }, []);

    // Para que cuando se le regrese el focus recargue la lista 
    useEffect(() => {
        return navigation.addListener('focus', () => {
            cargarObjetos();
        });
    }, [navigation]);

    const handleEditar = async (objetoId) => {
        getObjetoById(objetoId).then((response) => {
            navigation.navigate('FormularioObjeto', { objetoParaEditar: response })
        }).catch((error) => {
            console.error('Error al editar el objeto:', error);
        });
    };

    const handleEliminar = (objetoId) => {

        deleteObjetoById(objetoId)
            .then((response) => {
                setObjetos(objetos.filter((objeto) => objeto.id !== objetoId));
            })
            .catch((error) => {
                console.error('Error al eliminar el objeto:', error);
                setMensaje('Error al eliminar el objeto');
            });
    };

    const handleAgregarObjeto = () => {
        navigation.navigate('FormularioObjeto');
    }

    return (
        <View style={styles.container}>
            {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
            <FlatList
                data={objetos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.nombre}</Text>
                        <Text style={{ color: (item.estado ? "green" : "brown") }}>{item.estado ? "Disponible" : "No disponible"}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.editButton]}
                                onPress={() => handleEditar(item.id)}
                            >
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.deleteButton]}
                                onPress={() => handleEliminar(item.id)}
                            >
                                <Text style={styles.buttonText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Botón flotante */}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={handleAgregarObjeto}
            />
        </View>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    mensaje: {
        fontSize: 16,
        color: 'red',
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    itemText: {
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        padding: 8,
        borderRadius: 5,
        marginLeft: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
    },
    editButton: {
        backgroundColor: 'blue',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'green', // Color de fondo del botón
    },
});