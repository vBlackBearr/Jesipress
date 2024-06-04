import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements';
import { deleteObjetoById, getObjetoById, updateObjetoById } from '../restMethods';
import QRCode from 'react-native-qrcode-svg';
// import RNFS from "react-native-fs"
// import Share from 'react-native-share';

const ObjectModal = ({ visible, object, handleCancel, handlePrestar, handleEditar, handleEliminar }) => {
    const [nombreEditMode, setNombreEditMode] = useState(false);

    const [nombre, setNombre] = useState(object?.nombre || "");
    const [codigo, setCodigo] = useState(object?.codigo || "");

    const [originalNombre, setOriginalNombre] = useState(object?.nombre || "");

    const nombreInputRef = useRef(null);

    useEffect(() => {
        if (nombreEditMode) {
            nombreInputRef.current.focus();
        }
    }, [nombreEditMode]);

    useEffect(() => {
        setNombre(object?.nombre || "");
        setCodigo(object?.codigo || "");
        setOriginalNombre(object?.nombre || "");
    }, [object]);

    useEffect(() => {
        cancelEditing()
    }, [visible])

    const handleEditDocument = (name) => {
        setNombreEditMode(false);

        if (name === "nombre") {
            setOriginalNombre(nombre); // Guardar el valor original
            setNombreEditMode(true);
        }
    };

    const handleEditingDocument = (name, value) => {
        if (name === "nombre") {
            setNombre(value);
        } else if (name === "codigo") {
            setCodigo(value);
        }
    };

    const handleUpdateDocument = (name) => {
        alert("Actualizando");
        setNombreEditMode(false);

        if (name === "nombre") {
            const { id, ...objectSinId } = object;
            const newObj = {
                ...objectSinId,
                nombre: nombre,
                codigo: codigo
            };
            updateObjetoById(object.id, newObj);
        } else if (name === "codigo") {
            const { id, ...objectSinId } = object;
            const newObj = {
                ...objectSinId,
                nombre: nombre,
                codigo: codigo
            };
            updateObjetoById(object.id, newObj);
        }
    };

    const cancelEditing = () => {
        if (nombreEditMode) {
            setNombre(originalNombre); // Restaurar el valor original
        }
        setNombreEditMode(false);
        Keyboard.dismiss();
    };

    //     function saveQrToDisk() {
    //         this.svg.toDataURL((data) => {
    //             RNFS.writeFile(RNFS.CachesDirectoryPath+"/some-name.png", data, 'base64')
    //               .then((success) => {
    //                   return CameraRoll.saveToCameraRoll(RNFS.CachesDirectoryPath+"/some-name.png", 'photo')
    //               })
    //               .then(() => {
    //                   this.setState({ busy: false, imageSaved: true  })
    //                   ToastAndroid.show('Saved to gallery !!', ToastAndroid.SHORT)
    //               })
    //         })
    //    }

    saveQRCode = () => {
        this.svg.toDataURL(callback);
    };



    function callback(dataURL) {
        console.log(dataURL);
        let shareImageBase64 = {
            title: 'React Native',
            url: `data:image/png;base64,${dataURL}`,
        };
        // Share.open(shareImageBase64).catch(error => console.log(error));
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={{ alignItems: "flex-end", width: '100%' }}>
                        <Icon name="close-circle" type="material-community" onPress={handleCancel} />
                    </View>

                    {/* Para Nombre */}
                    <TouchableOpacity
                        style={{ display: 'flex', flexDirection: 'row', alignContent: "center", width: 'auto' }}
                        onPress={() => handleEditDocument("nombre")}
                    >
                        <TextInput
                            style={styles.titulo}
                            value={nombre}
                            onChangeText={(text) => handleEditingDocument("nombre", text)}
                            ref={nombreInputRef}
                            editable={nombreEditMode}
                            blurOnSubmit={false}
                        />
                        <Text> </Text>
                        {!nombreEditMode ? (
                            <Icon name="pencil" type="material-community" />
                        ) : (
                            <>
                                <Icon
                                    name="check"
                                    type="material-community"
                                    color={"green"}
                                    style={{ marginBottom: 15, marginLeft: 10 }}
                                    size={40}
                                    onPress={() => handleUpdateDocument("nombre")}
                                />
                                <Icon
                                    name="close"
                                    type="material-community"
                                    color={"red"}
                                    style={{ marginBottom: 15, marginLeft: 10 }}
                                    size={40}
                                    onPress={cancelEditing}
                                />
                            </>
                        )}
                    </TouchableOpacity>


                    {/* Para Estado */}
                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <Text style={styles.mensaje}>Estado:</Text>
                        <Text style={{
                            color: (object.estado ? "green" : "brown"),
                            ...styles.mensaje
                        }}> {object.estado ? "Disponible" : "Prestado"}</Text>
                    </View>


                    {/* Para codigo */}
                    <TouchableOpacity
                        style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}
                        onPress={() => handleEditDocument("codigo")}
                    >
                        <View style={styles.codigoView}>
                            <View style={{ width: '100%', marginBottom: 15, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Codigo: </Text>
                                <Icon name="pencil" type="material-community" />
                                <Icon name="export-variant" type="material-community" onPress={() => saveQRCode()}/>
                            </View>

                            <QRCode value={codigo} size={200} getRef={c => (this.svg = c)} />

                            <Text style={{ marginTop: 10 }}>{codigo}</Text>

                        </View>

                    </TouchableOpacity>

                    {/* Botones */}
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            padding: 10,
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 30,
                        }}>
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={() => handleEliminar(object.id)}
                        >
                            <Text style={styles.buttonText}>Eliminar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: '90%',
                                height: 60,
                                backgroundColor: '#c57d56',
                                ...styles.button
                            }}
                            onPress={handlePrestar}>
                            <Text>Prestar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
    },
    mensaje: {
        fontSize: 16,
        marginBottom: 16,
        alignSelf: 'center'
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    botonCancelar: {
        color: 'red',
        fontSize: 16,
        marginRight: 16,
    },
    botonAceptar: {
        color: 'green',
        fontSize: 16,
    },
    codigoView: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        borderRadius: 10,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center"
    },
    editButton: {
        backgroundColor: '#84b6f4',
        width: '40%',
        height: 30,
        margin: '5%',
        borderRadius: 10,
    },
    deleteButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#ff6961',
        width: '40%',
        height: 30,
        margin: '5%',
    },
});

export default ObjectModal;
