ssh -o StrictHostKeyChecking=no ${user}@${ipStaging} << EOF
echo "1. pull code from bitbucket......"
sudo su
cd ${pathLandingStaging}
git checkout --force release/juicy-network
git pull origin release/juicy-network

echo "2. updating build......."
sudo pm2 stop landing
rm -rf .next/
unzip latestBuildCI.zip
sudo pm2 start landing
rm -rf latestBuildCI.zip
echo '------------------------Done!------------------'
EOF