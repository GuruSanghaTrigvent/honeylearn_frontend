#!/bin/bash

# Replace these values with your Supabase project details
SUPABASE_DB_HOST="akanbrlhgiqbtvfznivv.supabase.co"
SUPABASE_DB_PORT="5432"
SUPABASE_DB_NAME="postgres"
SUPABASE_DB_USER="postgres"
SUPABASE_DB_PASSWORD="YOUR_DB_PASSWORD"  # Get this from Supabase dashboard

# Command to connect to Supabase database
echo "Connecting to Supabase database..."
psql "postgresql://${SUPABASE_DB_USER}:${SUPABASE_DB_PASSWORD}@${SUPABASE_DB_HOST}:${SUPABASE_DB_PORT}/${SUPABASE_DB_NAME}"

# Alternative connection string format
echo "Alternative connection string:"
echo "postgresql://${SUPABASE_DB_USER}:${SUPABASE_DB_PASSWORD}@${SUPABASE_DB_HOST}:${SUPABASE_DB_PORT}/${SUPABASE_DB_NAME}" 