#!/bin/bash

# API URL
API_URL="https://api.cloudways.com/api/v1"

# Variables
SERVER_ID="$1"
APP_ID="$2"
EMAIL="$3"
API_KEY="$4"

fetchAccessToken() {
    local email="$1"
    local apiKey="$2"
    tokenResponse=$(curl -s -X "POST" "$API_URL/oauth/access_token" \
        -d "email=$email&api_key=$apiKey")
    echo "$tokenResponse" | jq -r '.access_token'
}

purgeCache() {
    local serverId="$1"
    local appId="$2"
    # Fetch the access token
    local accessToken=$(fetchAccessToken "$EMAIL" "$API_KEY")

    # Call the API directly
    response=$(curl -s -X "POST" "$API_URL/app/cache/purge" \
        -H "Authorization: Bearer $accessToken" \
        -d "server_id=$serverId" -d "app_id=$appId")
    echo "$response" | jq -r '.status'
}

# Call the function to purge cache
purgeStatus=$(purgeCache "$SERVER_ID" "$APP_ID")
echo "Cache purge status: $purgeStatus"
