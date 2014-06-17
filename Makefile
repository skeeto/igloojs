VERSION = 0.1.1

igloo-$(VERSION).js : vecn.js igloo.js
	cat $^ | yui-compressor --type js > $@
