
function ExportQR() {

    saveQRCode = () => {
        this.svg.toDataURL(callback);
    };



    function callback(dataURL) {
        console.log(dataURL);
        let shareImageBase64 = {
            title: 'React Native',
            url: `data:image/png;base64,${dataURL}`,
            subject: 'Share QR', //  for email
        };
        Share.open(shareImageBase64).catch(error => console.log(error));
    }
}


export default ExportQR;