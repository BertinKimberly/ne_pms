#!/bin/bash

# Variables
DB_NAME="pms"        # Replace with your database name
DB_USER="postgres"             # Replace with your database username
DB_HOST="localhost"                  # Replace with your database host, if not local
DB_PORT="5432"                       # Replace with your database port, default is 5432
BACKUP_DIR="../backups"    # Replace with the directory where you want to save the backup
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Run pg_dump
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"

# Check if the dump was successful
if [ $? -eq 0 ]; then
    echo "Backup of database '$DB_NAME' completed successfully."
    echo "Backup file: $BACKUP_FILE"
else
    echo "Error occurred while taking backup of database '$DB_NAME'."
fi
