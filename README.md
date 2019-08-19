# Node RED pi-hole remote

## under active development

This Node RED module controls a remote pi-hole.

> Node-RED is a tool for wiring together hardware devices, APIs and online services in new and interesting ways.

If you like it, please consider:

<a target="blank" href="https://brave.com/nai412"><img src="./examples/support_banner.png"/></a>
<a target="blank" href="https://paypal.me/NeumannBenjamin"><img src="https://img.shields.io/badge/Donate-PayPal-blue.svg"/></a>
<a target="blank" href="https://blockchain.info/payment_request?address=3KDjCmXsGFYawmycXRsVwfFbphog117N8P"><img src="https://img.shields.io/badge/Donate-Bitcoin-green.svg"/></a> 

## Getting started

First of all install [Node-RED](http://nodered.org/docs/getting-started/installation)

```
$ sudo npm install -g node-red
```

Then open  the user data directory  `~/.node-red`  and install the package

```
$ cd ~/.node-red
$ npm install node-red-contrib-pi-hole-remote
```

Or search for ical-events in the manage palette menu

Then run

```
node-red
```

## Develop

* git clone https://github.com/naimo84/node-red-contrib-pi-hole-remote.git
* cd node-red-contrib-pi-hole-remote
* npm install
* gulp
* cd ~/.node-red 
* npm install /path/to/node-red-contrib-pi-hole-remote

## Usage

### Configuration:
- ***URL*** URL of pi-hole


## The MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Coded with :heart: in :it:
