import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native';
import { deleteObjetoById, getAllObjetos, getObjetoById, getPrestamoById } from "../src/restMethods";
import { FAB } from 'react-native-paper';
import ObjectModal from "../src/modals/ObjectModal";
import { useFocusEffect } from '@react-navigation/native';

export const ObjetosScreen = ({ navigation, router }) => {
    const [objetos, setObjetos] = useState([]);
    const [mensaje, setMensaje] = useState('');

    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null);
    const [createMode, setCreateMode] = useState(false)

    const [modalNewObject, setModalNewObject] = useState(false)
    const [newName, setNewName] = useState("")
    const textInputRefNewName = useRef(null);

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
            .catch((e) => {
                console.log('Error obteniendo todos los objetos', e);
            });
    };

    useEffect(() => {
        cargarObjetos();
    }, []);

    useEffect(() => {
        cargarObjetos();
        // alert("Cargando objetos...");
    }, [modalVisibility]);

    useEffect(() => {
        setNewName("")
        if (modalNewObject) {
            textInputRefNewName.current.focus();
        }
    }, [modalNewObject]);

    useEffect(() => {
        // alert("Cargando objetos...");

    }, [navigation]);

    useEffect(() => {
        // alert("Cargando objetos por el stack navigation...");

    }, [router?.params.focus]);

    const handleAgregarObjeto = () => {
        setModalNewObject(true)
    };

    return (
        <View style={styles.container}>
            {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
            <FlatList
                data={objetos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const handleDetailsButton = () => {

                        //Hacemos el create mode a false para asegurarnos de que es modo de detalles
                        setCreateMode(false);
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
                color='green'
            />


            <ObjectModal
                visible={modalVisibility}
                object={selectedObject}
                handleClose={() => setModalVisibility(false)}
                navigation={navigation}
                createMode={createMode}
            />

            {/* Modal para Nuevo nombre para creacion de nuevo objeto */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalNewObject}
                onRequestClose={() => setModalNewObject(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.titulo}>Ingresa el nombre del Nuevo Objeto</Text>
                        <TextInput
                            style={{ width: '100%', height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 10, fontSize: 16 }}
                            value={newName}
                            onChangeText={(e) => { setNewName(e) }}
                            ref={textInputRefNewName} />
                        <View style={styles.botonesContainer}>
                            <TouchableOpacity onPress={() => {
                                setModalNewObject(false)
                                setNewName("")
                            }}>
                                <Text style={styles.botonCancelar}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setModalNewObject(false)
                                const newObj = {
                                    nombre: newName
                                }
                                setSelectedObject(newObj)
                                setModalNewObject(false)
                                setCreateMode(true);
                                setModalVisibility(true);
                            }}>
                                <Text style={styles.botonAceptar}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
        backgroundColor: 'white',
        borderColor: 'green',
        borderWidth: 3,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        alignItems: 'flex-start'
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        zIndex: 1
    }, botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }, botonCancelar: {
        color: 'red',
        fontSize: 16,
        marginRight: 16,
    },
    botonAceptar: {
        color: 'green',
        fontSize: 16,
    },
});
