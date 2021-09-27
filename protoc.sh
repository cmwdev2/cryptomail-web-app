#!/usr/bin/env bash

protoc \
    --proto_path=../crates/cryptomail/proto/ \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=service=grpc-web:./src/proto \
    --js_out=import_style=commonjs,binary:./src/proto \
    ../crates/cryptomail/proto/*/*.proto

# hack output js files to disable typescript checks

for f in ./src/proto/api/*.js; do
    printf '/* eslint-disable */\n//@ts-nocheck\n' | cat - "${f}" > temp && mv temp "${f}"
done

for f in ./src/proto/types/*.js; do
    printf '/* eslint-disable */\n//@ts-nocheck\n' | cat - "${f}" > temp && mv temp "${f}"
done
