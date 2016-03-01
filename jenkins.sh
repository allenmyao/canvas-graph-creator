#!/bin/sh
fuser -k 8080/tcp
npm install
gulp &
cd selenium-tests
mvn test
cd ..
fuser -k 8080/tcp
