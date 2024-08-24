// Function to stop Quagga live camera feed
function stopQuagga() {
    Quagga.stop();
    console.log("Camera feed stopped.");
}

// Initialize Quagga for live camera scanning
Quagga.init({
    inputStream: {
        type: "LiveStream",
        target: document.querySelector('#camera-box'),
        constraints: {
            width: 800,
            height: 600,
            facingMode: "environment" // Use the back camera if available
        },
    },
    decoder: {
        readers: ["code_128_reader"] // Add other readers if needed
    },
}, function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Quagga initialized.");
    Quagga.start(); // Start the live camera feed
});

// Listen for detected barcodes and log them to the console
Quagga.onDetected(function (data) {
    const code = data.codeResult.code;
    console.log("Barcode detected: ", code);
});

// Handle file input for scanning
document.getElementById('file-input').addEventListener('change', function (event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        stopQuagga(); // Stop live camera feed

        const reader = new FileReader();
        reader.onload = function (e) {
            const cameraBox = document.getElementById('camera-box');
            cameraBox.style.backgroundImage = `url(${e.target.result})`;

            // Show the scanner line
            const scanner = document.querySelector('.scanner');
            if (scanner) {
                scanner.style.display = 'block';
            }

            // Decode the barcode from the image
            const img = new Image();
            img.onload = function () {
                Quagga.decodeSingle({
                    src: img.src,
                    numOfWorkers: 0,
                    inputStream: {
                        size: 800
                    },
                    decoder: {
                        readers: ["code_128_reader"] // Add other readers if needed
                    },
                }, function (result) {
                    if (result && result.codeResult) {
                        console.log("Barcode detected from file: ", result.codeResult.code);
                    } else {
                        console.log("No barcode detected in the file.");
                    }
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        console.log("Please choose an image file.");
    }
});