#!/bin/bash
set -e

# Run database migrations
bundle exec rails db:migrate

# Then exec the container's main process (what's set as CMD in Dockerfile)
exec "$@"