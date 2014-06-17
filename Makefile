VERSION = 0.1.0

igloo-$(VERSION).js : vecn.js igloo.js
	cat $^ | yui-compressor --type js > $@
