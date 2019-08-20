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
            callApi("summary", node, configNode);
        }
        if (command === "enable") {
            callApi("enable", node, configNode);
            setTimeout(function () {
                getPiholeValues("summary", node, configNode);
                getPiholeValues("summaryRaw", node, configNode);
            }, 1000);
        }
        if (command === "disable") {
            callApi("disable", node, configNode);
            setTimeout(function () {
                getPiholeValues("summary", node, configNode);
                getPiholeValues("summaryRaw", node, configNode);
            }, 1000);
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
    function getPiholeValues(strURL, node, config) {
        var httpOptions = {
            url: "http://" + config.url + "/admin/api.php?" + strURL + "&auth=" + config.auth,
            method: "GET",
            json: true
        };
        var httpsOptions = {
            url: "http://" + config.url + "/admin/api.php?" + strURL + "&auth=" + config.auth,
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
                for (var i in content) {
                    if (typeof (content[i]) !== "object") {
                        if (content.hasOwnProperty(i)) {
                            node.send({
                                payload: content[i], ack: true
                            });
                        }
                    }
                    else {
                        if (content.hasOwnProperty(i)) {
                            for (var j in content[i]) {
                                if (typeof (content[i][j]) !== "object") {
                                    if (strURL == "topItems" || strURL == "getQuerySources" || strURL == "overTimeData10mins" || strURL == "getForwardDestinations") {
                                        node.send({
                                            payload: "[" + JSON.stringify(content[i]) + "]", ack: true
                                        });
                                    }
                                    else {
                                        node.send({
                                            payload: content[i][j], ack: true
                                        });
                                    }
                                }
                                else {
                                    if (content[i].hasOwnProperty(j)) {
                                        for (var k in content[i][j]) {
                                            if (typeof (content[i][j][k]) !== "object") {
                                                node.send({
                                                    payload: content[i][j][k], ack: true
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    RED.nodes.registerType("pi-hole-control", eventsNode);
};
