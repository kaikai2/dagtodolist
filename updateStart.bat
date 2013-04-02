set mongodbdata=d:\mongodbdata
net stop mongodb
mongod --repair --dbpath %mongodbdata% --logpath %mongodbdata%\log.txt
mongod --dbpath %mongodbdata% --logpath %mongodbdata%\log.txt --install --rest
net start mongodb
npm update & start node app
