import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';


const ObjectModal = ({ visible, object, handleCancel, handlePrestar }) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={null}
        >
            <View style={styles.modalContainer}>

                <View style={styles.modalContent}>
                    <View style={{alignItems: "flex-end"}}>
                        <Icon name="close-circle" type="material-community" onPress={handleCancel}/>
                    </View>
                    <Text style={styles.titulo}>{object?.nombre}</Text>
                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <Text style={styles.mensaje}>Estado:</Text>
                        <Text style={{
                            color: (object.estado ? "green" : "brown"),
                            ...styles.mensaje
                        }}> {object.estado ? "Disponible" : "Prestado"}</Text>
                    </View>
                    <View style={{ width: '100%', alignItems: 'center', padding: 10 }}>
                        <TouchableOpacity
                            style={{
                                width: '90%',
                                height: 60,
                                backgroundColor: '#ce5000',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10
                            }}
                            onPress={handlePrestar}>
                            <Text>Prestar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}


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

export default ObjectModal;