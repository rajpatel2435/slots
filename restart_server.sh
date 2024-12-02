#!/bin/bash

# Define the path to your Node.js server entry file
SERVER_PATH="./dist/server/entry.mjs"

# Check if the Node.js server process is running
if ! lsof -i :4321; then
	    echo "Node.js server is not running. Restarting..."
	        # Restart the Node.js server
		  HOST=127.0.0.1 PORT=4321 node ./dist/server/entry.mjs &
else
      echo "Node.js server is running."
fi

echo "Cron job executed at $(date)" >> cron_job.log