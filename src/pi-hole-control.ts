
import { Red, Node } from 'node-red';
import request = require('request');

export interface Config {
    url: string,
    command: string,
    auth: string,
    https: boolean
}

module.exports = function (RED: Red) {

    function eventsNode(config: any) {
        RED.nodes.createNode(this, config);
        let configNode = RED.nodes.getNode(config.confignode) as unknown as Config;
        this.disabletime = config.disabletime;
        this.name = config.name;
        this.statustime = config.statustime;
        try {
            this.on('input', (msg) => {
                if (!msg.payload.hasOwnProperty("command")) {
                    if (msg.payload !== "") {
                        msg.payload = JSON.parse(msg.payload);
                    } else {
                        msg.payload = null;
                    }
                }
                if (msg.payload && msg.payload.statustime) {
                    this.statustime = msg.payload.statustime;
                }
                if (msg.payload && msg.payload.disabletime) {
                    this.disabletime = msg.payload.disabletime;
                }

                if (msg.payload && msg.payload.command) {
                    this.command = msg.payload.command;
                }
                else {
                    this.command = (config.command || "").trim();
                }

                executeCommand(this.command, this, configNode);
            });
        }
        catch (err) {
            this.error('Error: ' + err.message);
            this.status({ fill: "red", shape: "ring", text: err.message })
        }
    }

    function executeCommand(command, node, configNode) {
        let timeout = (node.statustime || 2) * 1000;
        if (command === "" || command === "summary" || command === "status") {
            callApi("summaryRaw", node, configNode, (content) => {
                node.send({
                    payload: content
                });
            });
        }
        if (command === "enable") {
            callApi("enable", node, configNode, () => {
                setTimeout(() => {
                    callApi("summaryRaw", node, configNode, (content) => {
                        node.send({
                            payload: content
                        });
                    });
                }, timeout);
            });
        }
        if (command === "disable") {
            callApi("disable", node, configNode, (content) => {
                setTimeout(() => {
                    callApi("summaryRaw", node, configNode, (content) => {
                        node.send({
                            payload: content
                        });
                    });
                }, timeout);
            });
        }
        if (command === "toggle") {
            callApi("summaryRaw", node, configNode, (current) => {
                var newStatus = "enable";
                if (current.status === 'enabled') {
                    newStatus = "disable";
                }

                callApi(newStatus, node, configNode, (enable) => {
                    setTimeout(() => {
                        callApi("summaryRaw", node, configNode, (content) => {
                            node.send({
                                payload: content
                            })
                        });
                    }, timeout);
                });
            });
        }
        if (command === "version") {
            callApi("version", node, configNode, (content) => {
                node.send({
                    payload: content
                });
            });
        }
    }


    function callApi(command: string, node, config: Config, callback) {

        if (command === "disable" && node.disabletime && node.disabletime > 0) {
            command = `disable=${node.disabletime}`;
        }

        const httpOptions = {
            url: `http://${config.url}/admin/api.php?${command}&auth=${config.auth}`,
            method: "GET",
            json: true,
            timeout: 2000
        };

        const httpsOptions = {
            url: `https://${config.url}/admin/api.php?${command}&auth=${config.auth}`,
            method: "GET",
            json: true,
            rejectUnauthorized: false,
            timeout: 2000
        };

        let reqOptions;
        if (config.https === true) {
            reqOptions = httpsOptions;
        } else {
            reqOptions = httpOptions;
        }

        request(reqOptions, (err, res, content) => {
            if (err) {
                callback({ status: "offline", error_code: err.code, name: node.name });
            } else if (res.statusCode != 200) {
                callback({ status: "offline", error_code: res.statusCode, name: node.name });
            } else {
                content.name = node.name;
                callback(content);
            }
        });
    }


    RED.nodes.registerType("pi-hole-control", eventsNode);
}