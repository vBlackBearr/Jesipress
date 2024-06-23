import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Keyboard, Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import { Divider } from '@rneui/themed';
import { DataContext } from '../providers/DataProvider';
import QRCode from 'react-native-qrcode-svg';
import ModalConfirmation from './ModalConfirmation'
import { CameraView } from 'expo-camera';
import QrCodeGenerator from '../utilities/QrCodeGenerator';
import saveQRCode from '../utilities/ExportQr'

const ObjectModal = ({ visible, object, handleClose, navigation, createMode = false }) => {

    const { createObjeto, deleteObjetoById, returnPrestamo, updateObjetoById } = useContext(DataContext);

    const [nombreEditMode, setNombreEditMode] = useState(false);

    const [nombre, setNombre] = useState(object?.nombre || "");
    const [codigo, setCodigo] = useState(object?.codigo || "");

    const [modalEliminar, setModalEliminar] = useState(false)
    const [modalDevolver, setModalDevolver] = useState(false)
    const [modalChangeCodigo, setModalChangeCodigo] = useState(false)
    const [modalChangeGeneratedCodigo, setModalChangeGeneratedCodigo] = useState(false)
    const [modalEditCode, setModalEditCode] = useState(false)

    const [originalNombre, setOriginalNombre] = useState(object?.nombre || "");
    const [originalCodigo, setOriginalCodigo] = useState(object?.codigo || "");

    const [codeEditOptionsView, setCodeEditOptionsView] = useState(false);
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const [scanningMode, setScanningMode] = useState(false)

    const [scanned, setScanned] = useState(false)

    const nombreInputRef = useRef(null);

    const textInputRef = useRef(null);

    useEffect(() => {
        if (nombreEditMode) {
            nombreInputRef.current.focus();
        }
    }, [nombreEditMode]);

    useEffect(() => {
        setNombre(object?.nombre || "");
        setCodigo(object?.codigo || "");
        setOriginalNombre(object?.nombre || "");
        setOriginalCodigo(object?.codigo || "");
    }, [object]);

    useEffect(() => {
        cancelEditing()
        if (createMode) {
            setCodigo(QrCodeGenerator().generateQrCode())
        }
    }, [visible])

    useEffect(() => {
        if (modalEditCode) {
            textInputRef.current.focus();
        }
    }, [modalEditCode]);

    const handleEditName = () => {
        cancelEditing()
        setNombreEditMode(true);
    };

    const handlePrestar = () => {
        navigation.navigate('ScanCredencial', { idObjeto: object?.id });
        handleClose()
    };

    const handleEliminar = () => {
        deleteObjetoById(object?.id)
            .then((response) => {
                // setObjetos(objetos.filter((objeto) => objeto.id !== object.id));
                // visible = false

            })
            .catch((error) => {
                console.error('Error al eliminar el objeto:', error);
                setMensaje('Error al eliminar el objeto');
            });
    };

    const handleUpdateNombre = () => {
        setNombreEditMode(false);

        if (!createMode) {
            const { id, ...objectSinId } = object;
            const newObj = {
                ...objectSinId,
                nombre: nombre,
                codigo: codigo
            };
            updateObjetoById(object.id, newObj);
            setOriginalNombre(nombre);
        }
    };

    const handleUpdateCodigo = (newCode) => {
        if (!createMode) {
            const { id, ...objectSinId } = object;
            const newObj = {
                ...objectSinId,
                nombre: nombre,
                codigo: newCode
            };
            updateObjetoById(object.id, newObj);
        }
        setOriginalCodigo(newCode);
        setCodigo(newCode)
    }

    const cancelEditing = () => {

        if (nombreEditMode) {
            setNombre(originalNombre); // Restaurar el valor original
        }
        setNombreEditMode(false);
        Keyboard.dismiss();

        setCodeEditOptionsView(false);
        setScanningMode(false);
    };

    const toogleShownEditCodeButtons = () => {
        cancelEditing()
        const isVisible = !codeEditOptionsView;
        setCodeEditOptionsView(isVisible);

        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: isVisible ? 0 : -100, // Slide down if isVisible is true, up if false
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: isVisible ? 1 : 0, // Fade in if isVisible is true, fade out if false
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }




    const handleScanCode = () => {
        toogleShownEditCodeButtons()
        setScanningMode(true);


    }

    const handleBarcodeScanned = ({ data }) => {
        setScanningMode(false)
        setCodigo(data)
        setModalChangeCodigo(true)
    }

    const handleGenerateCode = () => {
        const newCode = QrCodeGenerator().generateQrCode()
        setCodigo(newCode)
        handleUpdateCodigo(newCode)
    }

    const handleEditCodeManually = () => {
        setModalEditCode(true)
        // textInputRef.current.focus();
    }

    const handleCrearObjeto = () => {
        const newObj = {
            nombre,
            codigo,
            estado: true,
            status: true
        };
        createObjeto(newObj).then(() => {
            handleClose()
        }).catch((error) => {
            console.error('Error al crear el objeto:', error);
            alert('Error al crear el objeto');
        });

    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => handleClose()}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={{ alignItems: "flex-end", width: '100%', zIndex: 1 }}>
                        <Icon name="close-circle" type="material-community" onPress={() => handleClose()} />
                    </View>


                    {/* Para Nombre */}
                    <TouchableOpacity
                        style={{ display: 'flex', flexDirection: 'row', alignContent: "center", width: 'auto', zIndex: 1 }}
                        onPress={() => handleEditName()}
                    >

                        <TextInput
                            style={styles.titulo}
                            value={nombre}
                            onChangeText={(text) => setNombre(text)}
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
                                    onPress={() => handleUpdateNombre()}
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

                    {/* <Divider inset={true} insetType="middle" width={5} color={'red'}/> */}

                    <Divider insetType="middle" orientation="vertical" width={5} />

                    {/* Para Estado */}
                    {!createMode ? (
                        <>
                            <View style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                                <Text style={styles.mensaje}>Estado:</Text>
                                <Text style={{
                                    color: (object?.estado ? "green" : "brown"),
                                    ...styles.mensaje
                                }}> {object?.estado ? "Disponible" : "Prestado"}</Text>
                            </View>

                            <Divider inset={true} insetType="middle" orientation="vertical" width={5} />
                        </>
                    ) : null}

                    {/* Para codigo */}
                    <View
                        style={{ display: 'flex', flexDirection: 'row', alignItems: "center", marginTop: 10 }}
                    >
                        <View style={styles.codigoView}>
                            <View style={{ width: '100%', marginBottom: 15, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Codigo: </Text>
                                <Icon name="pencil" type="material-community" onPress={() => toogleShownEditCodeButtons()} />
                                <Icon name="export-variant" type="material-community" onPress={() => saveQRCode(this)} />
                            </View>

                            <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: opacityAnim, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 10 }}>

                                <TouchableOpacity style={[styles.editCodebutton, { width: 'auto' }]} onPress={() => codeEditOptionsView ? handleScanCode() : null}>
                                    <Text style={styles.buttonText}>Escanear código</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.editCodebutton} onPress={() => codeEditOptionsView ? setModalChangeGeneratedCodigo(true) : null}>
                                    <Text style={styles.buttonText}>Generar código</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.editCodebutton, { maxWidth: 150 }]} onPress={() => codeEditOptionsView ? handleEditCodeManually() : null}>
                                    <Text style={styles.buttonText}>Editar manual</Text>
                                </TouchableOpacity>

                            </Animated.View>

                            {scanningMode ? (
                                <CameraView style={{ width: '90%', height: 200 }}
                                    barcodeScannerSettings={{
                                        barcodeTypes: ["qr"],
                                    }}
                                    onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                                >
                                    <View style={{ alignItems: "flex-end", width: '100%', marginTop: 5, left: -5 }}>
                                        <Icon name="close-circle" type="material-community" onPress={() => setScanningMode(false)} />
                                    </View>
                                    <Icon
                                        name='scan-outline'
                                        type='ionicon'
                                        color='rgba(128,128,128, 0.8)'
                                        size={170}

                                    />
                                </CameraView>
                            ) : (
                                codigo ? (
                                    <QRCode value={codigo} size={200} getRef={(c) => (this.svg = c)} />) : null

                            )}


                            <Text style={{ marginTop: 10 }}>{!scanningMode ? codigo : ""}</Text>

                        </View>

                    </View>

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
                        {!createMode ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => setModalEliminar(true)}
                                >
                                    <Text style={{ fontWeight: 'bold', fontSize: 12, ...styles.buttonText }}>Eliminar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        width: '90%',
                                        height: 60,
                                        borderColor: (object?.estado ? '#c57d56' : '#FCFD95'),
                                        ...styles.button
                                    }}
                                    onPress={object?.estado ? () => handlePrestar() : () => setModalDevolver(true)}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{object?.estado ? "Prestar" : "Devolver"}</Text>
                                </TouchableOpacity>
                            </>

                        ) : (
                            <View>
                                <TouchableOpacity onPress={() => handleCrearObjeto()} style={[styles.button, { borderColor: "green", padding: 20 }]}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'green' }}>Guardar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                </View>
            </View>

            {/* Para eliminacion */}
            <ModalConfirmation
                visible={modalEliminar}
                onCancel={() => setModalEliminar(false)}
                onConfirm={() => {
                    setModalEliminar(false)
                    handleClose()
                    handleEliminar(object.id)
                }}
                title={"Confirmar Eliminación"}
                text={"¿Estás seguro de que deseas eliminar este objeto?, no se eliminaran los prestamos realcionados"}

            />

            {/* Para devolucion */}
            <ModalConfirmation
                visible={modalDevolver}
                onCancel={() => setModalDevolver(false)}
                onConfirm={() => {

                    returnPrestamo(object).then(() => {
                        setModalDevolver(false)
                        handleClose()

                    })
                }}
                title={"Confirmar Devolucion"}
                text={"¿Estás seguro de que deseas devolver este objeto?"}
            />

            {/* Para confirmar cambiar codigo escaneado */}
            <ModalConfirmation
                visible={modalChangeCodigo}
                onCancel={() => {
                    setCodigo(originalCodigo)
                    setModalChangeCodigo(false)
                }}
                onConfirm={() => {
                    handleUpdateCodigo(codigo)
                    setModalChangeCodigo(false)
                }}
                title={"Actualizar Codigo"}
                text={"¿Estas seguo que quieres actualizar el codigo a " + codigo + "?"}
            />

            {/* Para confirmar asignar nuevo codigo */}
            <ModalConfirmation
                visible={modalChangeGeneratedCodigo}
                onCancel={() => setModalChangeGeneratedCodigo(false)}
                onConfirm={() => {
                    handleGenerateCode()
                    setModalChangeGeneratedCodigo(false)
                }}
                title={"Asignar nuevo codigo"}
                text={"¿Estas seguo que quieres asignar un nuevo codigo?"}
            />

            {/* Modal para editar codigo */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditCode}
                onRequestClose={() => setModalEditCode(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.titulo}>Edicion de codigo:</Text>
                        <TextInput
                            style={{ width: '100%', height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 10, fontSize: 16 }}
                            value={codigo}
                            onChangeText={(e) => { setCodigo(e) }}
                            ref={textInputRef} />
                        <View style={styles.botonesContainer}>
                            <TouchableOpacity onPress={() => {
                                setCodigo(originalCodigo)
                                setModalEditCode(false)
                            }}>
                                <Text style={styles.botonCancelar}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setModalEditCode(false)
                                handleUpdateCodigo(codigo)
                            }}>
                                <Text style={styles.botonAceptar}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>



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
        zIndex: 1
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
        alignItems: "center",
        borderWidth: 2
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
        borderColor: '#ff6961',
        borderWidth: 2,
        width: '40%',
        height: 30,
        margin: '5%',
    },
    horizontalText: {
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 10,
    },
    editCodebutton: {
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 2,
        width: '30%',
        height: 50,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 100,
        paddingHorizontal: 10,
        zIndex: 10,
    },
});

export default ObjectModal;
