#!/bin/bash

BACKUP_DIR=~/backups/my_db
BACKUP_FILE=my_db.bak
DB_CONTAINER=postgres
DB_NAME=postgres
APP_CONTAINERS="api"

# Stop all the application containers
for container in $APP_CONTAINERS; do
  docker stop $container
done

# Create database
docker exec $DB_CONTAINER createdb -U postgres $DB_NAME

# Copy backup file to container
docker cp $BACKUP_DIR/$BACKUP_FILE $DB_CONTAINER:$BACKUP_FILE

# Restore database
docker exec $DB_CONTAINER sh -c "psql -U postgres -d $DB_NAME < $BACKUP_FILE"

# Start all the application containers
for container in $APP_CONTAINERS; do
  docker start $container
done