#!/bin/bash
#Program: pulsar-ssl.sh
#Script to Configure NginX SSL Server for Pulsar(https) <cavirin-sudhirk>

#instance_ip=$1
#Nginx variables
upstream='$upstream'
host='$host'
remote_addr='$remote_addr'
proxy_add_x_forwarded_for='$proxy_add_x_forwarded_for'
request_uri='$request_uri'
scheme='$scheme'

#Creating the ssl directory for storing key and certificates
sudo rm -rf /etc/nginx/ssl
mkdir -p /etc/nginx/ssl

#Create directory for storing ssl Configuration Snippet
sudo rm -rf /etc/nginx/snippets
mkdir -p /etc/nginx/snippets
sudo chmod -R 662 /etc/nginx
#Creating ssl certificate/etc/ssl/private
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-subj "/C=US/ST=California/L=Santa Clara/O=Cavirin/OU=www/CN=Cavirin Inc." \
	-keyout /etc/nginx/ssl/nginx-selfsigned.key -out /etc/nginx/ssl/nginx-selfsigned.crt
#sudo openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 \
#    -subj "/C=US/ST=California/L=Santa Clara/O=Cavirin/OU=www/CN=Cavirin Inc." \
#    -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt

#Configuration Snippet Pointing to the SSL Key and Certificate:
#cat << SNIPPET_CONF | sudo tee /etc/nginx/snippets/self-signed.conf >& /dev/null
#ssl_certificate /etc/nginx/ssl/nginx-selfsigned.crt;
#ssl_certificate_key /etc/nginx/ssl/nginx-selfsigned.key;
#SNIPPET_CONF


#Snippet with Strong Encryption Settings
cat << PARAM_CONF | sudo tee /etc/nginx/snippets/ssl-params.conf >& /dev/null
# from https://cipherli.st/
# and https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html

ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
ssl_ecdh_curve secp384r1;
ssl_session_cache shared:SSL:10m;
#ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
# Disable preloading HSTS for now.  You can use the commented out header line that includes
# the "preload" directive if you understand the implications.
#add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
add_header Strict-Transport-Security "max-age=63072000; includeSubdomains";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
client_max_body_size 300M;
#ssl_dhparam /etc/ssl/certs/dhparam.pem;
PARAM_CONF

#REMOVING THE EXISTING default from /etc/nginx/sites-enable
if [ -f /etc/nginx/sites-enabled/pulsar_saas_ssl ]; then
      echo "Removing /etc/nginx/sites-enabled/pulsar_saas_ssl"
      sudo rm /etc/nginx/sites-enabled/pulsar_saas_ssl
fi

#REMOVING THE EXISTING default from /etc/nginx/sites-available
if [ -f /etc/nginx/sites-available/pulsar_saas_ssl ]; then
      echo "Removing /etc/nginx/sites-available/pulsar_saas_ssl"
      sudo rm -f /etc/nginx/sites-available/pulsar_saas_ssl
fi
#The main conf file for sites-available:
cat << NGINX_CONF | sudo tee /etc/nginx/sites-available/pulsar_saas_ssl >& /dev/null
server {
listen    80;
return 301 https://$host$request_uri;
}

server {
	
    # SSL configuration
    server_name SaaS.cavirin.com;
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    #include snippets/self-signed.conf;
    include snippets/ssl-params.conf;
	
          
        			
		location / {
				try_files $uri $uri/ =404;
				proxy_pass  http://localhost:3000;
                                proxy_set_header    Host             $host;
                                proxy_set_header    X-Real-IP        $remote_addr;
                                proxy_set_header    X-Forwarded-For  $proxy_add_x_forwarded_for;
                                proxy_set_header X-Forwarded-Proto $scheme;
                                #proxy_set_header    X-Client-Verify  SUCCESS;
                                #proxy_set_header    X-Client-DN      $ssl_client_s_dn;
                                #proxy_set_header    X-SSL-Subject    $ssl_client_s_dn;
                                #proxy_set_header    X-SSL-Issuer     $ssl_client_i_dn;
                                proxy_read_timeout 1800;
                                proxy_connect_timeout 1800;

				access_log /var/log/nginx/home_ac.log;
				error_log /var/log/nginx/home_er.log;				
				
		}
                
                location  /app/ {               
                        # First attempt to serve request as file, then
                        # as directory, then fall back to displaying a 404.
                        #try_files  / =404;
                        proxy_pass http://127.0.0.1:3000/app/;                                  
                                        access_log /var/log/nginx/app_ac.log;
                                        error_log /var/log/nginx/app_er.log;
                        # Uncomment to enable naxsi on this location
                        # include /etc/nginx/naxsi.rules
                }
  
                #location /customer/ #{
                #  proxy_pass https://$instance_ip/pulsar/;
                #  access_log /var/log/nginx/customer_ac.log;
                #  error_log /var/log/nginx/customerer.log;              
                #}
                
               location /css/ {
                  proxy_pass http://127.0.0.1:3000/css/;
                  access_log /var/log/nginx/css_ac.log;         
                  error_log /var/log/nginx/css_er.log;    
               }

              location /js/ {
                proxy_pass http://127.0.0.1:3000/js/;
                access_log /var/log/nginx/js_ac.log;
                error_log /var/log/nginx/js_er.log;
              }
              ssl_certificate /etc/nginx/ssl/nginx-selfsigned.crt;
              ssl_certificate_key /etc/nginx/ssl/nginx-selfsigned.key;
}
NGINX_CONF

sudo ln -s /etc/nginx/sites-available/pulsar_saas_ssl /etc/nginx/sites-enabled/pulsar_saas_ssl

sudo chmod -R 511 /etc/nginx
#Test Ngix New Config file syntax:
sudo nginx -t

#Restart nginx
sudo service nginx restart

echo "End of SSL Configuration"
