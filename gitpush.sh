#!/bin/bash

# Check if a commit message was provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <commit-message>"
  exit 1
fi

# Stage all changes
git add .

# Commit with the provided message
git commit -m "$1"

# Push changes to the remote repository
git push

echo "Changes have been committed and pushed successfully."