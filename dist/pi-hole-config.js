module.exports = function (RED) {
    function piholeConfig(config) {
        RED.nodes.createNode(this, config);
        this.url = config.url;
        this.name = config.name;
    }
    RED.nodes.registerType("pi-hole-config", piholeConfig);
};
