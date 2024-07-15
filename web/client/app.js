const ws = new WebSocket('ws://89.116.74.170:5000');

ws.onmessage = function(event) {
    print('Atualizando')
    const img = document.getElementById('cameraFeed');
    img.src = 'data:image/jpeg;base64,' + event.data;
};

ws.onerror = function(error) {
    console.error('WebSocket Error: ', error);
};

ws.onopen = function() {
    console.log('WebSocket connection established');
};

ws.onclose = function() {
    console.log('WebSocket connection closed');
};
