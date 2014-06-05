VERSION = 0.0.3

igloo-$(VERSION).js : vecn.js igloo.js
	cat $^ | yui-compressor --type js > $@
