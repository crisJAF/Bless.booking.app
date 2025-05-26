window.blessNotificaciones = {
    connection: null,

    iniciarConexion: function () {
        if (!("Notification" in window)) {
            console.warn("Este navegador no soporta notificaciones.");
            return;
        }

        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/notificacionhub")
            .withAutomaticReconnect()
            .build();

        this.connection.on("RecibirNotificacion", function (mensaje) {
            // ✅ Notificación visual en la barra del navegador
            if (Notification.permission === "granted") {
                new Notification("📅 Bless Barber Shop", {
                    body: mensaje,
                    icon: "/img/bless-logo.png" // Puedes personalizarlo
                });
            } else {
                // Fallback toast si no hay permiso
                const toast = document.createElement("div");
                toast.className = "toast show bg-dark text-white position-fixed top-0 end-0 m-3 p-3 rounded shadow";
                toast.style.zIndex = 1100;
                toast.innerHTML = `<div class="toast-body">${mensaje}</div>`;
                document.body.appendChild(toast);
                setTimeout(() => document.body.removeChild(toast), 5000);
            }
        });

        this.connection.start().catch(err => console.error(err.toString()));
    }
};
