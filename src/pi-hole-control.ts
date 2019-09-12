
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
        try {
            this.on('input', (msg) => {
                if (!msg.payload.hasOwnProperty("command")) {
                    msg.payload = JSON.parse(msg.payload);
                }
                if (msg.payload.command) {
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
                }, 1000);
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
                }, 1000);
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
                    }, 1000);
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
                if (err.code) {
                    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
                        callback({ status: "offline" });
                    } else {
                        callback(err);
                    }
                } else {
                    callback(err);
                }
            }
            else if (res.statusCode != 200) {
                callback({ status: "offline" });
            } else {
                callback(content);
            }
        });
    }


    RED.nodes.registerType("pi-hole-control", eventsNode);
}