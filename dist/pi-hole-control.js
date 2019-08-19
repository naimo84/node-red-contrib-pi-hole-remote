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
                getpiHoleConfig(_this, configNode);
                console.log(_this.command);
                console.log(configNode.url);
            });
            this.on('close', function () {
            });
        }
        catch (err) {
            this.error('Error: ' + err.message);
            this.status({ fill: "red", shape: "ring", text: err.message });
        }
    }
    function getpiHoleConfig(node, config) {
        request({
            url: config.url,
            json: true
        }, function (error, response, content) {
            if (!error && response.statusCode == 200) {
                var myObject = JSON.parse(content);
                node.send({
                    payload: myObject
                });
            }
        });
    }
    RED.nodes.registerType("pi-hole-control", eventsNode);
};
