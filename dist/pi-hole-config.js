module.exports = function (RED) {
    function piholeConfig(config) {
        RED.nodes.createNode(this, config);
        this.url = config.url;
        this.name = config.name;
        this.auth = config.auth;
        this.https = config.https;
    }
    RED.nodes.registerType("pi-hole-config", piholeConfig);
};
