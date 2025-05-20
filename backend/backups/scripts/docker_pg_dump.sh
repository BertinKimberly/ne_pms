#!/bin/bash

BACKUP_DIR=~/backups/my_db
BACKUP_FILE=postgres.bak
DB_CONTAINER=postgres
DB_NAME=postgres
APP_CONTAINERS="api"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Stop all the application containers
for container in $APP_CONTAINERS; do
  docker stop $container
done

# Take backup of the database
docker exec $DB_CONTAINER sh -c "pg_dump -U postgres $DB_NAME > $BACKUP_FILE"

# Copy the backup file to local machine
docker cp $DB_CONTAINER:$BACKUP_FILE $BACKUP_DIR/$BACKUP_FILE

# Start all the application containers
for container in $APP_CONTAINERS; do
  docker start $container
done