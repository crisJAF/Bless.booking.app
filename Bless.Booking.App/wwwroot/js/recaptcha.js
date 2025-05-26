let recaptchaHelper = null;

function initRecaptchaCallback(dotNetHelper) {
    recaptchaHelper = dotNetHelper;

    window.onRecaptchaSuccess = function () {
        if (recaptchaHelper) {
            recaptchaHelper.invokeMethodAsync("RecaptchaValidado")
                .catch(err => console.error("❌ Error en invokeMethodAsync:", err));
        }
    };
}

function disposeRecaptchaCallback() {
    recaptchaHelper = null;
    window.onRecaptchaSuccess = () => { };
}
