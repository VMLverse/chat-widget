// messenger-toggle.js
function toggleMessenger() {
    if (window.messenger_opened == false) {
        window.messenger_opened = true;
        $('.helper').css({ "visibility": "hidden" }).removeClass('animate__tada animate__animated');
        $('.share, .fab').removeClass('active');
        Genesys("command", "Messenger.open");
    } else {
        window.messenger_opened = false;
        Genesys("command", "Messenger.close");
        focusHelper();
    }
}
