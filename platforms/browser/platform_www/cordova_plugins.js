cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-dgram/www/dgram.js",
        "id": "cordova-plugin-dgram.dgram",
        "pluginId": "cordova-plugin-dgram",
        "clobbers": [
            "dgram"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/src/browser/InAppBrowserProxy.js",
        "id": "cordova-plugin-inappbrowser.InAppBrowserProxy",
        "pluginId": "cordova-plugin-inappbrowser",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/src/browser/network.js",
        "id": "cordova-plugin-network-information.NetworkInfoProxy",
        "pluginId": "cordova-plugin-network-information",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-common/events.js",
        "id": "cordova-plugin-chrome-apps-common.events",
        "pluginId": "cordova-plugin-chrome-apps-common",
        "clobbers": [
            "chrome.Event"
        ]
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-common/errors.js",
        "id": "cordova-plugin-chrome-apps-common.errors",
        "pluginId": "cordova-plugin-chrome-apps-common"
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-common/stubs.js",
        "id": "cordova-plugin-chrome-apps-common.stubs",
        "pluginId": "cordova-plugin-chrome-apps-common"
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-common/helpers.js",
        "id": "cordova-plugin-chrome-apps-common.helpers",
        "pluginId": "cordova-plugin-chrome-apps-common"
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-sockets-udp/sockets.udp.js",
        "id": "cordova-plugin-chrome-apps-sockets-udp.sockets.udp",
        "pluginId": "cordova-plugin-chrome-apps-sockets-udp",
        "clobbers": [
            "chrome.sockets.udp"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-dgram": "0.1.5",
    "cordova-plugin-inappbrowser": "1.7.1",
    "cordova-plugin-network-information": "1.3.3",
    "cordova-plugin-chrome-apps-common": "1.0.7",
    "cordova-plugin-chrome-apps-sockets-udp": "1.3.0"
}
// BOTTOM OF METADATA
});