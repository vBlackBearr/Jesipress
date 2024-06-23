
import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'


const saveQRCode = (obj) => {
    obj.svg.toDataURL((data) => {
        FileSystem.writeAsStringAsync(FileSystem.cacheDirectory + "/qr.png", data, { encoding: FileSystem.EncodingType.Base64 }).then(() => {
            shareAsync(FileSystem.cacheDirectory + "/qr.png", { mimeType: 'image/png', dialogTitle: 'Compartir QR' })
        })
    })
};


export default saveQRCode;