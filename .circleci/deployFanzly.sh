
ssh -o StrictHostKeyChecking=no ${user}@${ip} << EOF
echo "1. pull code from bitbucket......"
sudo su
cd ${fanzlyPath}
git checkout --force release/fanzly
git reset --hard
git clean -fd
git pull
set NODE_ENV=production
echo "9. SASS rebuild"s
sudo rm -R node_modules
sudo rm package-lock.json
sudo npm rebuild node-sass

echo "2. Installing Dependency......"
sudo npm install

echo "3. running build......."
npm run build 

echo "4. Restart node server......"
sudo npm install forever -g 
forever stop server.js
forever start server.js


EOF
