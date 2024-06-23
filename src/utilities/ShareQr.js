import FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import RNFS from "react-native-fs"


const ShareQr = ({ qrCode }) => {
    this.svg.toDataURL((data) => {

        RNFS.writeFile(RNFS.CachesDirectoryPath + "/qr.png", data, 'base64').then((success) => {
            shareAsync(RNFS.CachesDirectoryPath + "/qr.png", { mimeType: 'image/png', dialogTitle: 'Compartir QR' })
        })
    })
}
