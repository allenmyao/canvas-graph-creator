#!/bin/bash

function stop {
	fuser -k 8080/tcp > /dev/null
}

function start {
	stop
	npm install > /dev/null
	gulp &
}

if [[ "$1" = "start" ]]; then
	start
elif [[ "$1" = "stop" ]]; then
	stop
else
	start
	cd selenium-tests
	mvn test
	cd ..
	stop
fi
