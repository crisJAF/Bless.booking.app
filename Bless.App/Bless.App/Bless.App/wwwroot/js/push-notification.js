window.notifications = {
    requestPermissionAndSubscribe: async () => {
        const registration = await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert("Permiso de notificación denegado");
            return;
        }

        const vapidPublicKey = 'BMb5-bS79iIDKxcJ8cz7ievxQhItjl_VnO2yK7dUJxP0spvW4gvfiSEGqZ2cNqlX2CbSbPjIIN7jBWWM2f4YnnQ';
        const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedKey
        });

        // Envía esta suscripción al backend para guardar
        const raw = subscription.toJSON();
        await fetch('https://localhost:7289/api/push/subscribe', {
            method: 'POST',
            body: JSON.stringify({
                endpoint: raw.endpoint,
                p256dh: raw.keys.p256dh,
                auth: raw.keys.auth
            }),
            headers: { 'Content-Type': 'application/json' }
        });

    }
};


function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
