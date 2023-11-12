To compile:

create .env in src folder 

Command to run on server

sudo npm cache clean --force

sudo rm -rf node_modules package-lock.json

sudo npm install

sudo pm2 start npm --name "my-train-app" -- run dev
