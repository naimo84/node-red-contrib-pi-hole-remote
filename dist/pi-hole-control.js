"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
module.exports = function (RED) {
    function eventsNode(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.confignode);
        var node = this;
        node.disabletime = config.disabletime;
        node.name = config.name;
        node.statustime = config.statustime;
        try {
            node.on('input', function (msg) {
                if (!msg.payload.hasOwnProperty("command")) {
                    if (msg.payload !== "") {
                        msg.payload = JSON.parse(msg.payload);
                    }
                    else {
                        msg.payload = null;
                    }
                }
                if (msg.payload && msg.payload.statustime) {
                    node.statustime = msg.payload.statustime;
                }
                if (msg.payload && msg.payload.disabletime) {
                    node.disabletime = msg.payload.disabletime;
                }
                if (msg.payload && msg.payload.command) {
                    node.command = msg.payload.command;
                }
                else {
                    node.command = (config.command || "").trim();
                }
                var found = false;
                if (msg.payload && msg.payload.pihole) {
                    RED.nodes.eachNode(function (n) {
                        if (n.type === 'pi-hole-config' && n.name === msg.payload.pihole) {
                            configNode = n;
                            found = true;
                        }
                    });
                }
                if (!found) {
                    configNode = RED.nodes.getNode(config.confignode);
                }
                node.pihole = configNode.name;
                executeCommand(node.command, node, configNode);
            });
        }
        catch (err) {
            node.error('Error: ' + err.message);
            node.status({ fill: "red", shape: "ring", text: err.message });
        }
    }
    function executeCommand(command, node, configNode) {
        var timeout = (node.statustime || 2) * 1000;
        if (command === "" || command === "summary" || command === "status") {
            callApi("summaryRaw", node, configNode, function (content) {
                node.send({
                    payload: content
                });
            });
        }
        if (command === "enable") {
            callApi("enable", node, configNode, function () {
                setTimeout(function () {
                    callApi("summaryRaw", node, configNode, function (content) {
                        node.send({
                            payload: content
                        });
                    });
                }, timeout);
            });
        }
        if (command === "disable") {
            callApi("disable", node, configNode, function (content) {
                setTimeout(function () {
                    callApi("summaryRaw", node, configNode, function (content) {
                        node.send({
                            payload: content
                        });
                    });
                }, timeout);
            });
        }
        if (command === "toggle") {
            callApi("summaryRaw", node, configNode, function (current) {
                var newStatus = "enable";
                if (current.status === 'enabled') {
                    newStatus = "disable";
                }
                callApi(newStatus, node, configNode, function (enable) {
                    setTimeout(function () {
                        callApi("summaryRaw", node, configNode, function (content) {
                            node.send({
                                payload: content
                            });
                        });
                    }, timeout);
                });
            });
        }
        if (command === "version") {
            callApi("version", node, configNode, function (content) {
                node.send({
                    payload: content
                });
            });
        }
    }
    function callApi(command, node, config, callback) {
        if (command === "disable" && node.disabletime && node.disabletime > 0) {
            command = "disable=" + node.disabletime;
        }
        var httpOptions = {
            url: "http://" + config.url + "/admin/api.php?" + command + "&auth=" + config.auth,
            method: "GET",
            json: true,
            timeout: 2000
        };
        var httpsOptions = {
            url: "https://" + config.url + "/admin/api.php?" + command + "&auth=" + config.auth,
            method: "GET",
            json: true,
            rejectUnauthorized: false,
            timeout: 2000
        };
        var reqOptions;
        if (config.https === true) {
            reqOptions = httpsOptions;
        }
        else {
            reqOptions = httpOptions;
        }
        request(reqOptions, function (err, res, content) {
            if (err) {
                callback({ status: "offline", error_code: err.code, name: node.name, pihole: node.pihole });
            }
            else if (res.statusCode != 200) {
                callback({ status: "offline", error_code: res.statusCode, name: node.name, pihole: node.pihole });
            }
            else {
                content.name = node.name;
                content.pihole = node.pihole;
                callback(content);
            }
        });
    }
    RED.nodes.registerType("pi-hole-control", eventsNode);
};
