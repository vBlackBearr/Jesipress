import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const ModalConfirmacion = ({ visible, onCancel, onConfirm }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.titulo}>Confirmar Eliminación</Text>
                    <Text style={styles.mensaje}>¿Estás seguro de que deseas eliminar este préstamo?</Text>
                    <View style={styles.botonesContainer}>
                        <TouchableOpacity onPress={onCancel}>
                            <Text style={styles.botonCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onConfirm}>
                            <Text style={styles.botonAceptar}>Aceptar</Text>
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
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    mensaje: {
        fontSize: 16,
        marginBottom: 16,
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
});

export default ModalConfirmacion;
