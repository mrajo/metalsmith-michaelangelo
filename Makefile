nodebin = node_modules/.bin/

node_modules: package.json
	@npm install

test: node_modules
	@$(nodebin)tape test/test*.js | $(nodebin)tap-spec

coverage:
	@$(nodebin)nyc tape test/test*.js | $(nodebin)tap-nyc

.PHONY: test coverage
