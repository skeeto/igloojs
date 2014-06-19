VERSION = 0.1.2

igloo-$(VERSION).js : igloo.js
	cat $^ > $@
