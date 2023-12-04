ssh -o StrictHostKeyChecking=no ${user}@${ipStaging} << EOF
echo "1. pull code from bitbucket......"
sudo su
cd ${pathStaging}
git checkout --force release/juicy-network
git pull origin release/juicy-network

echo "2. updating build......."
sudo pm2 stop juicyNetwork
rm -rf .next/
mv .env.subdomain .env
unzip latestBuildCI.zip
sudo pm2 start juicyNetwork
rm -rf latestBuildCI.zip
echo '------------------------Done!------------------'
EOF