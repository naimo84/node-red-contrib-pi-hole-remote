# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.1.4...v0.2.0) (2021-10-29)


### Bug Fixes

* 'hasOwnProperty' of undefined, [#23](https://github.com/naimo84/node-red-contrib-pi-hole-remote/issues/23) ([ecc60bf](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/ecc60bf6637bdffb941df229f133c57ccc79b5e5))

### [0.1.4](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.1.3...v0.1.4) (2020-01-04)


### Bug Fixes

* issue [#7](https://github.com/naimo84/node-red-contrib-pi-hole-remote/issues/7), output of pihole name always the samefeat: issue [#7](https://github.com/naimo84/node-red-contrib-pi-hole-remote/issues/7), command to all pihole at the same time ([1ca0e97](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/1ca0e9716fdd3be68ab0f0165348d3fcf74d6daf))

### [0.1.3](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.1.2...v0.1.3) (2019-12-30)


### Bug Fixes

* [#5](https://github.com/naimo84/node-red-contrib-pi-hole-remote/issues/5), json parse error ([b128e76](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/b128e7605dec17fe222750beda519b85f10c105d))

### [0.1.2](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.1.1...v0.1.2) (2019-12-29)


### Features

* issue [#5](https://github.com/naimo84/node-red-contrib-pi-hole-remote/issues/5), configurable pihole as input message ([ec4d821](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/ec4d821da23992dea812b9d830ebb42f60ac3526))

### [0.1.1](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.1.0...v0.1.1) (2019-12-29)


### Bug Fixes

* issue [#5](https://github.com/naimo84/node-red-contrib-pi-hole-remote/issues/5), use pihole name from config, not form node ([dba97ea](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/dba97ea))

## [0.1.0](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.0.10...v0.1.0) (2019-12-28)


### Features

* issue [#5](https://github.com/naimo84/node-red-contrib-pi-hole-remote/issues/5), name to msg.payload ([27ba3e4](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/27ba3e4))

### [0.0.13](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.0.10...v0.0.13) (2019-12-28)


### Features

* issue [#5](https://github.com/naimo84/node-red-contrib-pi-hole-remote/issues/5), name to msg.payload ([27ba3e4](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/27ba3e4))

### [0.0.10](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.0.9...v0.0.10) (2019-09-14)


### Features

* new statustime, disabletime as payload ([0535eb5](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/0535eb5))

### [0.0.9](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.0.8...v0.0.9) (2019-09-12)


### Bug Fixes

* alwas return error_code + status "offline" ([c759691](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/c759691))

### [0.0.8](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.0.7...v0.0.8) (2019-09-12)


### Bug Fixes

* filter request for statusCodes unequal 200 ([effcaa9](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/effcaa9))

### [0.0.7](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.0.6...v0.0.7) (2019-09-11)


### Bug Fixes

* offline status ([7df000a](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/7df000a))

### [0.0.6](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.0.5...v0.0.6) (2019-09-11)


### Bug Fixes

* timeout is now 2 seconds ([47755d1](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/47755d1))

### [0.0.5](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.0.4...v0.0.5) (2019-09-11)


### Features

* payload is "offline", if pi-hole not reached ([a2f618f](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/a2f618f))

### [0.0.4](https://github.com/naimo84/node-red-contrib-pi-hole-remote/compare/v0.0.3...v0.0.4) (2019-09-10)


### Features

* implemented disabletime ([68df363](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/68df363))
* toggle enable / disable ([60f004c](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/60f004c))

### 0.0.3 (2019-09-09)


### Bug Fixes

* removed static configNode ([bfe57a6](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/bfe57a6))


### Features

* standard-version ([0ee7844](https://github.com/naimo84/node-red-contrib-pi-hole-remote/commit/0ee7844))

<a name="0.0.1"></a>
## [0.0.1] (2019-08-19)

### Features

* **pi-hole-control:** initial commit