#!/bin/sh
# usage: call.sh <method> <json-params>   -> raw JSON-RPC result
K=$(python3 -c "import json;print(json.load(open('/home/sanketh/.claude.json'))['mcpServers']['stitch']['headers']['X-Goog-Api-Key'])")
curl -s --max-time 600 https://stitch.googleapis.com/mcp -H "X-Goog-Api-Key: $K" -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"$1\",\"arguments\":$2}}"
