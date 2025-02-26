.PHONY: default build clean docs pretty lint test run

default: clean build

build: output

clean:
	rm -rf ./output

docs:
	@echo "No documentation included by default."

pretty:
	yarn biome check --write --no-errors-on-unmatched

lint:
	yarn biome check .
	yarn tsc --noEmit

test:
	@echo "This project has no tests."

run: clean
	yarn vite serve


node_modules:
	yarn install

output: node_modules
	yarn vite build

preview: clean
	yarn vite preview
