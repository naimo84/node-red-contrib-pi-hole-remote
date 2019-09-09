
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
            callApi("summaryRaw", node, configNode);
        }
        if (command === "enable") {
            callApi("enable", node, configNode);
            setTimeout(() => {
                callApi("summaryRaw", node, configNode);              
            }, 1000);
        }
        if (command === "disable") {
            callApi("disable", node, configNode);
            setTimeout(() => {
                callApi("summaryRaw", node, configNode);
            }, 1000);
        }
        if(command==="version"){            
            callApi("version", node, configNode);
        }
    }


    function callApi(command: string, node: Node, config: Config) {

        const httpOptions = {
            url: `http://${config.url}/admin/api.php?${command}&auth=${config.auth}`,
            method: "GET",
            json: true
        };

        const httpsOptions = {
            url: `https://${config.url}/admin/api.php?${command}&auth=${config.auth}`,
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


    RED.nodes.registerType("pi-hole-control", eventsNode);
}