#!/bin/bash
set -e

# Clean and create dist directory
rm -rf dist
mkdir -p dist dist/admin dist/student

# Build landing page
echo "Building landing page..."
cp -r landing-page/* dist/

# Copy admin dashboard files (if already built)
echo "Copying admin dashboard assets..."
if [ -d "admin-dashboard/dist" ]; then
  cp -r admin-dashboard/dist/* dist/admin/
  mkdir -p dist/admin/assets
  cp -r admin-dashboard/src/assets/* dist/admin/assets/
else
  echo "Warning: admin-dashboard/dist not found, skipping"
  mkdir -p dist/admin
  echo "<html><body><h1>Admin Dashboard Placeholder</h1></body></html>" > dist/admin/index.html
fi

# Copy student dashboard files (if already built)
echo "Copying student dashboard assets..."
if [ -d "student-dashboard/build" ]; then
  cp -r student-dashboard/build/* dist/student/
else
  echo "Warning: student-dashboard/build not found, skipping"
  mkdir -p dist/student
  echo "<html><body><h1>Student Dashboard Placeholder</h1></body></html>" > dist/student/index.html
fi

# Create _redirects file
cat > dist/_redirects << EOF
# Static assets
/admin/assets/*  /admin/assets/:splat   200
/student/images/*  /student/images/:splat   200

# Application routes
/admin     /admin/    301
/admin/*   /admin/index.html   200
/student   /student/  301
/student/* /student/index.html   200
/intake    /admin/index.html   200
/intake/*  /admin/index.html   200

# Default fallback
/*        /index.html   200
EOF

echo "Build complete! Starting server..."
npx serve -s dist