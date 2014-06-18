VERSION = 0.1.1

igloo-$(VERSION).js : igloo.js
	cat $^ > $@
