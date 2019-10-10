nodebin = node_modules/.bin/

node_modules: package.json
	@npm install

test: node_modules
	@$(nodebin)tape test/test*.js | $(nodebin)tap-spec

coverage:
	@$(nodebin)nyc --reporter=lcov tape test/test*.js | $(nodebin)tap-min

.PHONY: test coverage
