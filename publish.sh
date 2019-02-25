#!/bin/bash
rm -rf client
rm -rf examples
rm -rf fuse-box
rm -rf jest
rm -rf proxies
rm -rf server
rm bridge.*
rm index.*

tsc -p ./src
yarn publish

