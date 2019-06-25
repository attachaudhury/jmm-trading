pm2 start npm --name "shopapi" -- start



sudo rm /etc/nginx/sites-enabled/shopadmin

sudo ln -s /etc/nginx/sites-available/shopadmin /etc/nginx/sites-enabled/

sudo nginx -t
sudo nginx -s reload
