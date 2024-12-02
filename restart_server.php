<?php
// Define the path to your Node.js server entry file
$serverPath = "./dist/server/entry.mjs";

// Check if the Node.js server process is running
$command = "lsof -i :4321";
$output = shell_exec( $command );

if ( empty( $output ) ) {
    echo "Node.js server is not running. Restarting...\n";
    // Restart the Node.js server
    shell_exec( "HOST=127.0.0.1 PORT=4321 node $serverPath > /dev/null 2>&1 &" );
}
else {
    echo "Node.js server is running.\n";
}

// Log the execution of the cron job
$logFile = "cron_job.log";
file_put_contents( $logFile, "Cron job executed at " . date( 'Y-m-d H:i:s' ) . "\n", FILE_APPEND );
?>