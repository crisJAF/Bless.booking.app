self.addEventListener("push", function (event) {
    const data = event.data.json();
    const title = data.title || "Notificación";
    const options = {
        body: data.body,
        icon: "/icon.png"
    };
    event.waitUntil(self.registration.showNotification(title, options));
});
