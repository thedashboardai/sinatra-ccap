#!/bin/bash
set -e

# Clean and create dist directory
rm -rf dist
mkdir -p dist

# Build landing page
echo "Building landing page..."
cp -r landing-page/* dist/

# Build admin dashboard
echo "Building admin dashboard..."
cd admin-dashboard
npm install --legacy-peer-deps
npm run build
mkdir -p ../dist/admin
cp -r dist/* ../dist/admin/
mkdir -p ../dist/admin/assets
cp -r src/assets/* ../dist/admin/assets/
cd ..

# Build student dashboard
echo "Building student dashboard..."
cd student-dashboard
npm install --legacy-peer-deps
export CI=false
npm run build
mkdir -p ../dist/student
cp -r build/* ../dist/student/
mkdir -p ../dist/student/images
cp -r public/images/* ../dist/student/images/
cd ..

# Copy netlify.toml
echo "Copying netlify.toml..."
cp netlify.toml dist/

echo "Build complete!"