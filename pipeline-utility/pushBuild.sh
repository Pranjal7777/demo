scp -o StrictHostKeyChecking=no -r latestBuildCI.zip ${user}@${ipStaging}:${pathLandingStaging} << EOF
echo '------------------------Zip Uploaded Successfully!------------------'
EOF