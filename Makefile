.PHONY: default build clean docs git-hook pretty lint test run

default: clean build

build: output

clean:
	rm --force --recursive node_modules output

docs:
	@echo "No documentation included by default."

git-hook:
	echo "make pretty" > .git/hooks/pre-commit

pretty:
	yarn biome check --write --no-errors-on-unmatched
	npm pkg fix

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
