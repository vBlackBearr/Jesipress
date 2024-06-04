import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteObjetoById, getAllObjetos, getObjetoById } from "../src/REST_METHODS";
import { FAB } from 'react-native-paper';
import ObjectModal from "../src/modals/ObjectModal";

export const ObjetosScreen = ({ navigation }) => {
    const [objetos, setObjetos] = useState([]);
    const [mensaje, setMensaje] = useState('');

    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null); // Cambié el valor inicial a null

    const cargarObjetos = () => {
        getAllObjetos()
            .then(async (response) => {
                setObjetos(response);
                let updatedObjetos = [...response];
                const promises = updatedObjetos.map(async (objeto) => {
                    if (!objeto.estado) {
                        const prestamo = await getPrestamoById(objeto.prestamo_id);
                        if (!updatedObjetos.some(item => item.numero_control === prestamo.numero_control && item.hora_solicitud === prestamo.hora_solicitud)) {
                            objeto.numero_control = prestamo.numero_control;
                            objeto.hora_solicitud = prestamo.hora_solicitud;
                        }
                    }
                    return objeto;
                });
                const resolvedObjetos = await Promise.all(promises);
                setObjetos(resolvedObjetos);
            })
            .catch(() => {
                console.log('Error obteniendo todos los objetos');
            });
    };

    useEffect(() => {
        cargarObjetos();
    }, []);

    useEffect(() => {
        cargarObjetos();
    }, [modalVisibility]);


    useEffect(() => {
        return navigation.addListener('focus', () => {
            cargarObjetos();
        });
    }, [navigation]);

    const handleAgregarObjeto = () => {
        navigation.navigate('FormularioObjeto');
    };

    const handlePrestar = () => {
        navigation.navigate('ScanCredencial', { idObjeto: selectedObject.id });
        setModalVisibility(false);
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

    const handleEditar = async (objetoId) => {
        getObjetoById(objetoId).then((response) => {
            setModalVisibility(false)
            navigation.navigate('FormularioObjeto', { objetoParaEditar: response });
        }).catch((error) => {
            console.error('Error al editar el objeto:', error);
        });
    };

    return (
        <View style={styles.container}>
            {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
            <FlatList
                data={objetos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const handleDetailsButton = () => {
                        setSelectedObject(item);
                        setModalVisibility(true);
                    };

                    return (
                        <View style={styles.item}>
                            <View style={styles.textContainter}>
                                <Text style={styles.itemText}>{item.nombre}</Text>
                                <Text style={{ color: (item.estado ? "green" : "brown") }}>{item.estado ? "Disponible" : "No disponible"}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.editButton, { backgroundColor: 'brown' }]}
                                    onPress={handleDetailsButton}
                                >
                                    <Text style={styles.buttonText}>Detalles</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity
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
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    );
                }}
            />

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={handleAgregarObjeto}
            />

            {selectedObject && (
                <ObjectModal
                    visible={modalVisibility}
                    object={selectedObject}
                    handleCancel={() => setModalVisibility(false)}
                    handlePrestar={handlePrestar}
                    handleEditar={handleEditar}
                    handleEliminar={handleEliminar}
                />
            )}
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'green',
    },
});
