
import { Red } from 'node-red';
import { callApi, Cmd, Config } from 'pi-hole-remote';

interface NodeConfig extends Config {
    name?: string;
    all?: boolean;
    statustime?: number;
}

module.exports = function (RED: Red) {

    function eventsNode(config: any) {
        let node = this;
        RED.nodes.createNode(node, config);

        try {
            node.on('input', (msg, send) => {
                let options: NodeConfig = {}
                options.name = config.name;
                options.all = config.all;

                if (msg.payload && !msg.payload.hasOwnProperty("command") && !msg.payload.hasOwnProperty("pihole")) {
                    if (msg.payload !== "") {
                        msg.payload = JSON.parse(msg.payload);
                    } else {
                        msg.payload = null;
                    }
                }
                options.statustime = RED.util.evaluateNodeProperty(config.statustime, config.statustimetype, config, msg);
                options.disabletime = RED.util.evaluateNodeProperty(config.disabletime, config.disabletimetype, config, msg);
                options.command = RED.util.evaluateNodeProperty(config.command, config.commandtype, config, msg);

                if (msg.payload && msg.payload.statustime) {
                    options.statustime = msg.payload.statustime;
                }
                if (msg.payload && msg.payload.disabletime) {
                    options.disabletime = msg.payload.disabletime;
                }
                if (msg.payload && msg.payload.command) {
                    options.command = msg.payload.command;
                }

                let configs = [];
                if ((msg.payload && msg.payload.pihole) || options.all === true) {
                    RED.nodes.eachNode(n => {
                        if (n.type === 'pi-hole-config' && (n.name === msg.payload.pihole || msg.payload.pihole == "all" || options.all === true)) {
                            configs.push(n);
                        }
                    })
                }

                if (configs.length === 0) {
                    configs.push(RED.nodes.getNode(config.confignode))
                }

                for (let configNode of configs) {
                    executeCommand(options.command as Cmd, options, send, configNode);
                }
            });
        }
        catch (err) {
            node.error('Error: ' + err.message);
            node.status({ fill: "red", shape: "ring", text: err.message })
        }
    }

    function executeCommand(command: Cmd, options, send, configNode: Config) {
        let timeout = (options.statustime || 2) * 1000;
        if (command.toString() === "" || command === Cmd.summary || command === Cmd.status) {
            callApiInternal(Cmd.summaryRaw, options, configNode, (content) => {
                send({
                    payload: content
                });
            });
        } else if (command === Cmd.version) {
            callApiInternal(Cmd.version, options, configNode, (content) => {
                send({
                    payload: content
                });
            });
        } else if (command === Cmd.enable || command === Cmd.disable) {
            callApiInternal(command, options, configNode, () => {
                setTimeout(() => {
                    callApiInternal(Cmd.summaryRaw, options, configNode, (content) => {
                        send({
                            payload: content
                        });
                    });
                }, timeout);
            });
        } else if (command === Cmd.toggle) {
            callApiInternal(Cmd.summaryRaw, options, configNode, (current) => {
                var newStatus = Cmd.enable;
                if (current.status === 'enabled') {
                    newStatus = Cmd.disable;
                }

                callApiInternal(newStatus, options, configNode, () => {
                    setTimeout(() => {
                        callApiInternal(Cmd.summaryRaw, options, configNode, (content) => {
                            send({
                                payload: content
                            })
                        });
                    }, timeout);
                });
            });
        }
    }

    async function callApiInternal(command: Cmd, options: any, config: NodeConfig, callback) {
        try {
            let content = await callApi(command, Object.assign(options, config)) as any
            content.name = options.name;
            content.pihole = config.name;
            callback(content);
        } catch (err) {
            if (err) {
                callback({ status: "offline", error_code: err.code, name: options.name, pihole: config.name });
            }
        }
    }

    RED.nodes.registerType("pi-hole-control", eventsNode);
}