#!/bin/bash
set -e

# Remove existing server pid if it exists
if [ -f /app/tmp/pids/server.pid ]; then
  rm /app/tmp/pids/server.pid
fi

# Run database migrations
bundle exec rails db:migrate 2>/dev/null || bundle exec rails db:setup

# Start Rails server
exec "$@"