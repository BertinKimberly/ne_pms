#!/bin/bash

# Variables
DB_NAME="pms"        # Replace with your database name
DB_USER="postgres"             # Replace with your database username
DB_HOST="localhost"                  # Replace with your database host, if not local
DB_PORT="5432"                       # Replace with your database port, default is 5432
BACKUP_FILE="../backups/pms_backup.sql" # Replace with the backup file path you want to restore from

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file '$BACKUP_FILE' does not exist."
    exit 1
fi

# Confirm restoration
echo "Are you sure you want to restore the database '$DB_NAME' from the backup file '$BACKUP_FILE'? This will overwrite the current data. (yes/no)"
read CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Database restoration aborted."
    exit 0
fi

# Drop the existing database
echo "Dropping existing database '$DB_NAME'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"

# Recreate the database
echo "Recreating database '$DB_NAME'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"

# Restore the database
echo "Restoring database '$DB_NAME' from backup file '$BACKUP_FILE'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

# Check if the restoration was successful
if [ $? -eq 0 ]; then
    echo "Database '$DB_NAME' restored successfully from '$BACKUP_FILE'."
else
    echo "Error occurred while restoring database '$DB_NAME'."
fi
