document.getElementById('file-input').addEventListener('change', function(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const cameraBox = document.getElementById('camera-box');
            cameraBox.style.backgroundImage = `url(${e.target.result})`;

            // Optionally, hide the scanner line if an image is loaded
            const scanner = document.querySelector('.scanner');
            if (scanner) {
                scanner.style.display = 'block';
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
});

document.getElementById('scan-btn').addEventListener('click', function() {
    const input = document.getElementById('file-input');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                Quagga.decodeSingle({
                    src: img.src,
                    numOfWorkers: 0,
                    inputStream: {
                        size: 800
                    },
                    decoder: {
                        readers: ["code_128_reader"]
                    },
                }, function(result) {
                    if(result && result.codeResult) {
                        alert("Barcode detected: " + result.codeResult.code);
                    } else {
                        alert("No barcode detected.");
                    }
                });
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        alert("Please choose an image file.");
    }
});
