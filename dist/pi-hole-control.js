"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
module.exports = function (RED) {
    var configNode;
    function eventsNode(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        configNode = RED.nodes.getNode(config.confignode);
        try {
            this.on('input', function (msg) {
                if (!msg.payload.hasOwnProperty("command")) {
                    msg.payload = JSON.parse(msg.payload);
                }
                if (msg.payload.command) {
                    _this.command = msg.payload.command;
                }
                else {
                    _this.command = (config.command || "").trim();
                }
                executeCommand(_this.command, _this, configNode);
            });
        }
        catch (err) {
            this.error('Error: ' + err.message);
            this.status({ fill: "red", shape: "ring", text: err.message });
        }
    }
    function executeCommand(command, node, configNode) {
        if (command === "" || command === "summary" || command === "status") {
            callApi("summaryRaw", node, configNode);
        }
        if (command === "enable") {
            callApi("enable", node, configNode);
            setTimeout(function () {
                callApi("summaryRaw", node, configNode);
            }, 1000);
        }
        if (command === "disable") {
            callApi("disable", node, configNode);
            setTimeout(function () {
                callApi("summaryRaw", node, configNode);
            }, 1000);
        }
        if (command === "version") {
            callApi("version", node, configNode);
        }
    }
    function callApi(command, node, config) {
        var httpOptions = {
            url: "http://" + config.url + "/admin/api.php?" + command + "&auth=" + config.auth,
            method: "GET",
            json: true
        };
        var httpsOptions = {
            url: "http://" + config.url + "/admin/api.php?" + command + "&auth=" + config.auth,
            method: "GET",
            json: true,
            rejectUnauthorized: false
        };
        var reqOptions;
        if (config.https === true) {
            reqOptions = httpsOptions;
        }
        else {
            reqOptions = httpOptions;
        }
        request(reqOptions, function (error, response, content) {
            if (!error && response.statusCode == 200) {
                node.send({
                    payload: content
                });
            }
        });
    }
    RED.nodes.registerType("pi-hole-control", eventsNode);
};
