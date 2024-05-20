import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {createObjeto, updateObjetoById} from '../src/REST_METHODS';
import {Button} from '@rneui/themed';

const FormularioObjeto = ({route, navigation}) => {

    const objetoParaEditar = route.params?.objetoParaEditar;
    const [nombre, setNombre] = useState('');
    const [qrCode, setQRCode] = useState('');
    const modoEdicion = !!objetoParaEditar;

    // //************************************************************************ *//
    // 
    //    Make on typing validation that there is not equal name in the database 
    //
    // //************************************************************************ *//

    const onGuardar = () => {
        navigation.navigate('ObjetosScreen');
    }

    useEffect(() => {
        if (modoEdicion) {
            setNombre(objetoParaEditar.nombre);
            setQRCode(objetoParaEditar.codigo)
        }
    }, [objetoParaEditar, modoEdicion]);

    useEffect(() => { 
        if (route.params?.code) {
            setQRCode(route.params.code);
        }
    }, [route.params?.code]);

    const handleGuardar = async () => {
        const nuevoObjeto = {
            nombre,
            codigo: qrCode,
            estado: true
        };

        try {
            if (modoEdicion) {
                await updateObjetoById(objetoParaEditar.id, nuevoObjeto);
            } else {
                await createObjeto(nuevoObjeto);
            }
            onGuardar();
        } catch (error) {
            console.error('Error al guardar el objeto:', error);
        }
    };

    const handleBarCodeScanned = ({type, data}) => {

    }

    const handleEscanearCodigo = () => {
        navigation.navigate('CameraCodeRegisterScreen', {nombre});
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
                placeholder="Nombre"
                value={nombre}
                onChangeText={(text) => setNombre(text)}
                style={styles.input}
            />

            <Button
                title={'Escanear Codigo'}
                onPress={handleEscanearCodigo}
                type="outline"
            />

            <Text style={styles.label}>Codigo</Text>
            <TextInput
                placeholder="Codigo"
                value={qrCode}
                onChangeText={(text) => setQRCode(text)}
                style={styles.input}
            />

            <Button title={modoEdicion ? 'Guardar Cambios' : 'Crear Objeto'} onPress={handleGuardar}/>
        </View>
    ); 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'blue',
    },
});

export default FormularioObjeto;
