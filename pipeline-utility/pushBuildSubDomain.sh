scp -o StrictHostKeyChecking=no -r latestBuildCI.zip ${user}@${ipStaging}:${pathStaging} << EOF
echo '------------------------Zip Uploaded Successfully!------------------'
EOF