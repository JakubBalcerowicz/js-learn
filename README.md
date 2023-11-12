To compile:
create .babelrc {
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-react-jsx"]
}
create .env in src folder 
Command to run on server 

clean npm cashe
npm install

sudo pm2 start npm --name "my-train-app" -- run dev
