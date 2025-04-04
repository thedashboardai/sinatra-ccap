#!/bin/bash
set -e

# Clean and create dist directory
rm -rf dist
mkdir -p dist dist/admin dist/student

# Build landing page
echo "Building landing page..."
cp -r landing-page/* dist/

# Copy admin dashboard files (if already built)
echo "Checking for admin dashboard build..."
if [ -d "admin-dashboard/dist" ]; then
  echo "Copying admin dashboard files..."
  cp -r admin-dashboard/dist/* dist/admin/
  mkdir -p dist/admin/assets
  cp -r admin-dashboard/src/assets/* dist/admin/assets/
else
  echo "Admin dashboard not built, building now..."
  cd admin-dashboard
  npm install --legacy-peer-deps
  npm run build
  cd ..
  cp -r admin-dashboard/dist/* dist/admin/
  mkdir -p dist/admin/assets
  cp -r admin-dashboard/src/assets/* dist/admin/assets/
fi

# Copy student dashboard files (if already built)
echo "Checking for student dashboard build..."
if [ -d "student-dashboard/build" ]; then
  echo "Copying student dashboard files..."
  cp -r student-dashboard/build/* dist/student/
else
  echo "Student dashboard not built, building now..."
  cd student-dashboard
  npm install --legacy-peer-deps
  CI=false npm run build
  cd ..
  cp -r student-dashboard/build/* dist/student/
fi

# Install express if needed
if ! npm list | grep -q express; then
  echo "Installing express..."
  npm install express
fi

# Start the express server
echo "Starting server..."
npm run serve