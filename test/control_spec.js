var should = require("should");
var helper = require("node-red-node-test-helper");

helper.init(require.resolve('node-red'));

describe('control Node', function () {

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload().then(function () {
            helper.stopServer(done);
        });
    });

    it('should be loaded', function (done) {
        var flow = [
            { id: "c1", type: "pi-hole-config" },
            { id: "n1", type: "pi-hole-control", config: "c1" }
        ];
        var piholeContainersNode = require("../dist/pi-hole-control.js");
        var piholeConfigNode = require("../dist/pi-hole-config.js");



        helper.load([piholeConfigNode, piholeContainersNode], flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('type', 'pi-hole-control');
            done();
        });
    });
});
