
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
                getpiHoleConfig(this, configNode);
                console.log(this.command);
                console.log(configNode.url);
            });

            this.on('close', () => {

            });
        }
        catch (err) {
            this.error('Error: ' + err.message);
            this.status({ fill: "red", shape: "ring", text: err.message })
        }
    }



    function getpiHoleConfig(node: Node, config: Config) {

        const httpOptions = {
            url: "http://" + config.url + "/admin/api.php?summary&auth=" + config.auth,
            method: "GET",
            json: true
        };

        const httpsOptions = {
            url: "https://" + config.url + "/admin/api.php?summary&auth=" + config.auth,
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
                var myObject = JSON.parse(content);

                node.send({
                    payload: myObject
                });
            }
        })

    }

    RED.nodes.registerType("pi-hole-control", eventsNode);
}