

/**
 * Created by rakesh on 2/11/17.
 */
const Redis = require('redis');
const nodemailer = require("nodemailer");
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('smtpconfig.properties');
const pg = require('pg');
const passUnhash = require('../utils/passwordhash.js');
var randomPasswordGenerator = require('generate-password');
require('dotenv').config()
var NginxConfFile = require('nginx-conf').NginxConfFile;

const config = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    port: process.env.DB_PORT,
    max: 100,
    idleTimeoutMillis: 30000,
};
var mustache = require('mustache');
var requireText = require('require-text');

const pool = new pg.Pool(config);
const password = passUnhash.decrypt(properties.get('com.cavirin.smtp.password'));

var smtpConfiguration = {
    "host":properties.get('com.cavirin.smtp.host'),
    "port":properties.get('com.cavirin.smtp.port'),
    "username":properties.get('com.cavirin.smtp.username'),
    "password":password
};

if(smtpConfiguration.port && smtpConfiguration.port ===465) secure = true;
else secure=false;

const transporter = nodemailer.createTransport({
    host: smtpConfiguration.host,
    port: smtpConfiguration.port,
    secure: secure,
    auth: {
        user: smtpConfiguration.username,
        pass: smtpConfiguration.password
    }
});

const redisClient = Redis.createClient();
const channel='notifications';

function reloadNginx(){
  const exec = require('child_process').exec;
                var yourscript = exec('sudo service nginx reload',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
            else
            {
                console.log("reloaded ");
            }
        });
}


function addNginxRoute(custId,ip ){

NginxConfFile.create('/etc/nginx/sites-available/pulsar_saas_ssl', function(err, conf) {
  if (err) {
    console.log(err);
    return;
  }

conf.on('flushed', function() {
    console.log('finished writing to disk');
  });

//console.log(conf.nginx.server._comments.length); // 1
//console.log(conf.nginx.server[1].listen[0]._value);
//console.log(conf.nginx)
/*
#location /customer/ #{
                #  proxy_pass https:///pulsar/;
                #  access_log /var/log/nginx/customer_ac.log;
                #  error_log /var/log/nginx/customerer.log;
                #}

conf.nginx.server[1]._comments.push('testing a new comment');
conf.nginx.server[1]._add('location','/customer'+custid);
*/


var current_count= conf.nginx.server[1].location.length;
//var ip='34.235.161.206';
//var cust_id='deltadental';
console.log(current_count);
conf.nginx.server[1]._add('location','/customer/'+custId);
conf.nginx.server[1].location[current_count]._add('proxy_pass','https://'+ip+'/pulsar/');
conf.nginx.server[1].location[current_count]._add('access_log','/var/log/nginx/customer_ac.log');
conf.nginx.server[1].location[current_count]._add('error_log','/var/log/nginx/customer_er.log');
conf.flush();
reloadNginx()

return "successfully added route";
});
//return "Success";

}

function removeNginxRoute(custId){

NginxConfFile.create('/etc/nginx/sites-available/pulsar_saas_ssl', function(err, conf) {
  if (err) {
    console.log(err);
    return;
  }

conf.on('flushed', function() {
    console.log('finished writing to disk');
  });

//console.log(conf.nginx.server._comments.length); // 1
//console.log(conf.nginx.server[1].listen[0]._value);
//console.log(conf.nginx)
});
return "Success";

}

redisClient.on("message", function(channel, message) {
    console.log("Message '" + message + "' on channel '" + channel + "' arrived!");
    var emailOptions;
    try{
        emailOptions = JSON.parse(message);
    }catch (err){
        console.log("Error parsing Json",err);
    }

    var contact={};
    var customerId ;
    pool.connect(function(err, pgclient, done) {
        var date_diff_indays = function(date1, date2) {
            dt1 = new Date(date1);
            dt2 = new Date(date2);
            return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
            }
        if (err) return console.log(err);
        var query = 'select * from contact where email =$1;';
        pgclient.query(query,[emailOptions.email], function(err, result) {
            done();
            if (err) console.log(err);
            else if (result.rows) contact=result.rows[0];
            var password = randomPasswordGenerator.generate({
                length: 10,
                numbers: true,
                uppercase: true,
                excludeSimilarCharacters : true,
                strict: true
            });
console.log("****************");
        console.log(contact);
console.log(result.rows[0].customerid);
console.log("****************");
customerId = contact.customerid;
console.log(customerId);
            var instance=[];
            var user=[];
            var user_update=[];
            user_update.push(password);
            user_update.push('Active');
            user_update.push(contact.customerid);
            user_update.push(contact.email);
            user_update.push('true');
            instance.push(emailOptions.instanceid);
            instance.push(emailOptions.server);
            instance.push('Active');
            instance.push(contact.customerid);

/* adding ngnix rule */
addNginxRoute(contact.customerid,emailOptions.server)

            var createInstance='insert into instances (pulsarinstanceid,ipaddress,status,customerid) values ($1,$2,$3,$4)';
            pgclient.query(createInstance,instance,function (err,result) {
                done();
                if (err) console.log(err);
                else{
            var updateuser='UPDATE users SET password=$1,status=$2,resetpassword=$5 WHERE customerid=$3 and login=$4';
            pgclient.query(updateuser,user_update,function (err,result) {
                done();
                if (err) console.log(err);
               else{
                    var entitlements='SELECT startdate,enddate,subtype FROM entitlements E JOIN customer C ON C.entitlementid=E.id WHERE C.id=$1';
                    pgclient.query(entitlements,[contact.customerid],function (err,result) {
                    done();
                    if (err) console.log(err);
                    else if (result.rows) entitlementdata=result.rows[0];

                        var days = date_diff_indays(entitlementdata.startdate,entitlementdata.enddate)
                        var subject = 'Activate Your Free Trial';
var requireText = require('require-text');
var mustache = require('mustache');
console.log(contact.email);
  var linkk = ""+emailOptions.host+"/app/login"
var view =
{
FirstName: contact.name,
email:contact.email,
password:password,
link:linkk
}
console.log(view);
                        var text = requireText('./activationEmail.html', require);
                        var rendered = mustache.render(text,view);
                        //console.log(rendered);

                    console.log(text);
                    let  mailOptions = {
                        from: smtpConfiguration.username,
                        to: contact.email,
                        subject: subject,
                        html: rendered
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) return console.log(error);
                        console.log('Message %s sent: %s', info.messageId, info.response);
                    });
            });
               }
            });
            }
            });

        var expirydays = 3;
        var today = new Date();
        var NewDate = new Date(today);
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        NewDate.setDate(NewDate.getDate() + expirydays);
        var threeDaysAdded = NewDate.toISOString();

        console.log(threeDaysAdded);
console.log();
console.log(customerId);
        var schedulerquery = 'INSERT INTO schedule (created,customerid,scheduleddate,action,emailtype) VALUES ($1,$2,$3,$4,$5);';
         pgclient.query(schedulerquery,[today,customerId,threeDaysAdded,'deprovisioning','terminate'], function(err, result) {
             done();
             if (err) console.log(err);
                else {
                console.log("scheduler updated sucessfully");
        }
         });




        });
    });

/*
     pool.connect(function(err, pgclient, done) {
         if (err) return console.log(err);
        var expirydays = 3;
        var today = new Date();
        var NewDate = new Date(today);
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        NewDate.setDate(NewDate.getDate() + expirydays);
        var threeDaysAdded = NewDate.toISOString();

        console.log(threeDaysAdded);
console.log();
console.log(customerId);
        var query = 'INSERT INTO schedule (created,customerid,scheduleddate,action,emailtype) VALUES ($1,$2,$3,$4,$5);';
         pgclient.query(query,[today,customerId,threeDaysAdded,'deprovisioning','terminate'], function(err, result) {
             done();
             if (err) console.log(err);
         });
     });
*/

});

redisClient.subscribe(channel);


const channelScheduler = "notifyScheduler";

var subscriber  = Redis.createClient();

var requireText = require('require-text');
var mustache = require('mustache');


subscriber.on("message", function(channelScheduler, message) {
    console.log("Message '" + message + "' on channel '" + channelScheduler + "' arrived!")
    var myObj;

    try {
        myObj = JSON.parse(message);
    }catch (err){
         console.log("Error Occurred",err)
    }
var contact = myObj.email;
console.log(contact);
            var password = randomPasswordGenerator.generate({
                length: 10,
                numbers: true,
                uppercase: true,
                excludeSimilarCharacters : true,
                strict: true
            });
//var text = myObj.message;

var requireText = require('require-text');

console.log(myObj.message);
console.log(myObj.name);

var mustache = require('mustache');

if(myObj.message =="xMinusSeven")
{
var text = requireText('./trialConclusionSevenDays.html', require);
var subjectt = "Cavirin Trial 7 Days Left";
var rendered = mustache.render(text, {FirstName: myObj.name});
//console.log(rendered);
}
else if(myObj.message =="xMinusTwo")
{

var text = requireText('./trialConclusionTwoDays.html', require);
var subjectt = "Cavirin Trial 2 Days Left";
var rendered = mustache.render(text, {FirstName: myObj.name});
//console.log(rendered);
}
else
{
                        var rendered='<div>Hello,<br/><br/>'
                        +'<p>Cavirin C2 is your hybrid enterprise security platform.<br/>'
                        +' Protect and monitor your infrastructure and respond to infrastructure security gaps!</p>'
                        +'<br/>'
                        +'<br/><br/>'
                        +'Thank you.<br/>'
                        +'Cavirin security team.'
                        +'</div>';
}

                let  mailOptions = {
                    from: smtpConfiguration.username,
                    to: contact,
                    subject: subjectt,
                    html: rendered
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) return console.log(error);
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });


        console.log(myObj);
});
subscriber.subscribe("notifyScheduler");



