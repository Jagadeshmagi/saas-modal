# README #

Pulsar SAAS application

### How to Deploy the application ###

* cd script
* Run below script in order
#### 1. System Setup  ####
* ~./pulsar-saas-system-installer
* installs the basic system requirment for run the application
- installing node,npm,pm2
- installing Python3,AWS CLI,Postgresql,Redis

#### 2. Deployment Setup ####
* ~ ./pulsar-saas-installer 

* This script deploy the nessary code and build the server with npm 
- dmlscript for postgres
- pull the code from bitbucket
- running node server on port 3000

Deployed URL will be http://<IPADDRESS/DOMAINNAME>:3000/