#!/bin/bash
set -ex

echo "waiting for 10 sec to let the system settle"
sleep 10
echo "Executing tests"

pytest -s -m order -o log_cli=true
pytest -s -m topup

echo "Done"
