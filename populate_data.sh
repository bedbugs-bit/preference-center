#!/bin/bash

# Base URL for API
BASE_URL="http://localhost:3000/api"

# Read the bulk data file
BULK_DATA=$(cat bulk_data.json)

# Extract users and events from the bulk data
USERS=$(echo "$BULK_DATA" | jq '.users')
EVENTS=$(echo "$BULK_DATA" | jq '.events')

echo "Populating Users..."
# Iterate through users and send POST requests
echo "$USERS" | jq -c '.[]' | while read -r user; do
  curl -X POST -H "Content-Type: application/json" -d "$user" "$BASE_URL/users"
  echo "" # For spacing in the terminal output
done

echo "Populating Events..."
# Iterate through events and send POST requests
echo "$EVENTS" | jq -c '.[]' | while read -r event; do
  curl -X POST -H "Content-Type: application/json" -d "$event" "$BASE_URL/events"
  echo "" # For spacing in the terminal output
done

echo "Data population complete!"
