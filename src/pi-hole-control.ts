
import { Red, Node } from 'node-red';
import request = require('request');

export interface Config {
    url: string,
    command: string,
    auth: string,
    https: boolean
}

module.exports = function (RED: Red) {
    let configNode: Config;

    function eventsNode(config: any) {
        RED.nodes.createNode(this, config);
        configNode = RED.nodes.getNode(config.confignode) as unknown as Config;

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
            callApi("summary", node, configNode);
        }
        if (command === "enable") {
            callApi("enable", node, configNode);
            setTimeout(() => {
                getPiholeValues("summary", node, configNode);
                getPiholeValues("summaryRaw", node, configNode);
            }, 1000);
        }
        if (command === "disable") {
            callApi("disable", node, configNode);
            setTimeout(() => {
                getPiholeValues("summary", node, configNode);
                getPiholeValues("summaryRaw", node, configNode);
            }, 1000);
        }
    }


    function callApi(command: string, node: Node, config: Config) {

        const httpOptions = {
            url: `http://${config.url}/admin/api.php?${command}&auth=${config.auth}`,
            method: "GET",
            json: true
        };

        const httpsOptions = {
            url: `http://${config.url}/admin/api.php?${command}&auth=${config.auth}`,
            method: "GET",
            json: true,
            rejectUnauthorized: false
        };

        let reqOptions;
        if (config.https === true) {
            reqOptions = httpsOptions;
        } else {
            reqOptions = httpOptions;
        }

        request(reqOptions, (error, response, content) => {
            if (!error && response.statusCode == 200) {
                node.send({
                    payload: content
                });
            }
        })

    }

    function getPiholeValues(strURL, node: Node, config: Config) {
        const httpOptions = {
            url: `http://${config.url}/admin/api.php?${strURL}&auth=${config.auth}`,
            method: "GET",
            json: true
        };

        const httpsOptions = {
            url: `http://${config.url}/admin/api.php?${strURL}&auth=${config.auth}`,
            method: "GET",
            json: true,
            rejectUnauthorized: false
        };

        let reqOptions;
        if (config.https === true) {
            reqOptions = httpsOptions;
        } else {
            reqOptions = httpOptions;
        }

        request(reqOptions, (error, response, content) => {
            if (!error && response.statusCode == 200) {
                for (const i in content) {
                    if (typeof (content[i]) !== "object") {
                        if (content.hasOwnProperty(i)) {

                            node.send({
                                payload: content[i], ack: true
                            })

                        }
                    } else {
                        if (content.hasOwnProperty(i)) {
                            for (const j in content[i]) {
                                if (typeof (content[i][j]) !== "object") {
                                    if (strURL == "topItems" || strURL == "getQuerySources" || strURL == "overTimeData10mins" || strURL == "getForwardDestinations") {
                                        node.send({
                                            payload: "[" + JSON.stringify(content[i]) + "]", ack: true
                                        })

                                    } else {
                                        node.send({
                                            payload: content[i][j], ack: true
                                        })
                                    }
                                } else {
                                    if (content[i].hasOwnProperty(j)) {

                                        for (const k in content[i][j]) {
                                            if (typeof (content[i][j][k]) !== "object") {
                                                node.send({
                                                    payload: content[i][j][k], ack: true
                                                })
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
}