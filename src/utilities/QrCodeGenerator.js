import uuid from 'react-native-uuid';

function QrCodeGenerator() {
    const generateQrCode = () => {
        return uuid.v4().substring(0,10);
    }

    return { 
        generateQrCode
    }
}

export default QrCodeGenerator;