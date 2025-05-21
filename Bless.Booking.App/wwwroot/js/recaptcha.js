function initRecaptchaCallback(dotNetHelper) {
    window.onRecaptchaSuccess = function () {
        dotNetHelper.invokeMethodAsync("RecaptchaValidado");
    };
}
function initRecaptchaCallback(dotNetHelper) {
    window.onRecaptchaSuccess = function () {
        dotNetHelper.invokeMethodAsync("RecaptchaValidado");
    };
}