/*
 * Saas Modal SERVER 
 * Api response status :  success -> if query works fine(HTTP_CODE:200)
 *                        failed -> query returns empty row(HTTP_CODE:200)
 *                        error -> something wrong happened in query(catch error)(HTTP_CODE:500)
 *
 * 
 *
 */

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import bodyParser from 'body-parser';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { routes } from './routes';
import ErrorPage from './components/ErrorPage';
import axios from 'axios'
require('dotenv').config()
const bcrypt = require('bcrypt');
var generator = require('generate-password');
const nodemailer = require('nodemailer');
const passUnhash = require('../utils/passwordhash.js');
var md5 = require('md5');

import Joi from 'joi';
var pgp      = require('pg-promise')(/*options*/);
var morgan   = require('morgan');
var QRE = pgp.errors.QueryResultError;
var qrec = pgp.errors.queryResultErrorCode;
/***************** Database Configuration ***********/
const pg = require('pg');

var config = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    port: process.env.DB_PORT,
    max: 100,
    idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);


var db = pgp(config);
console.log(db);

// configure app

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
   // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(morgan('dev')); // log requests to the console

app.get('/', function(req, res) {
 res.redirect('/app/login');
});

// universal routing and rendering
app.get('/app*', (req, res) => {
  console.log("klkl",process.env.HOME)
  match(
    { routes, location: req.url },
    (err, redirectLocation, renderProps) => {

      // in case of error display the error message
      if (err) {
        return res.status(500).send(err.message);
      }

      // in case of redirect propagate the redirect to the browser
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      // generate the React markup for the current route
      let markup;
      if (renderProps) {
        // if the current route matched we have renderProps
        markup = renderToString(<RouterContext {...renderProps}/>);
      } 
      else {
        // otherwise we can render a 404 page
        markup = renderToString(<ErrorPage/>);
        res.status(404)
      }

      // render the index template with the embedded React markup
      return res.render('index',{markup});
    }
  );
});

app.post('/api/provision', function(req, res) {
  console.log("Provision Data :"+JSON.stringify(req.body));
  //console.log("Provision Data Customer Name:"+JSON.stringify(req.body.provisionData.customerName));
  //console.log("Provision Data preferences:"+JSON.stringify(req.body.provisionData.preferences));
  //console.log("Provision Data contact:"+JSON.stringify(req.body.provisionData.contact));
  return res.json({"result":"SUCCESS"});
});

// Validation/Sanitization Schema for each api Url
const getCustomersSchema = Joi.object({
  name: Joi.string().min(2).required()
});
const getpreferencesSchema = Joi.object({
  customerid: Joi.number().integer().positive().required(),
  infrastructuresize: Joi.string().min(2).required(),
  industrytype: Joi.string().min(2).required(),
  complianceframework: Joi.string().min(2).required(),
  infastructuretype: Joi.string().min(2).required(),
  noofdailyassesments: Joi.number().integer().positive().required()
});
const getcontactSchema = Joi.object({
  customerid: Joi.number().integer().positive().required(),
  name: Joi.string().min(2).required(),
  addr1: Joi.string().min(2).required(),
  addr2: Joi.string().min(2).required(),
  city: Joi.string().min(2).required(),
  state: Joi.string().min(2).required(),
  zip: Joi.string().min(2).required(),
  phone: Joi.string().min(2).required(),
  email: Joi.string().min(2).required()
});
const getprocessSchema = Joi.object({
  customerid: Joi.number().integer().positive().required(),
  name: Joi.string().min(2).required(),
  addr1: Joi.string().min(2).required(),
  addr2: Joi.string().min(2).required(),
  city: Joi.string().min(2).required(),
  state: Joi.string().min(2).required(),
  zip: Joi.string().min(2).required(),
  phone: Joi.string().min(2).required(),
  email: Joi.string().min(2).required(),
  customerid: Joi.number().integer().positive().required(),
  infrastructuresize: Joi.string().min(2).required(),
  industrytype: Joi.string().min(2).required(),
  complianceframework: Joi.string().min(2).required(),
  infastructuretype: Joi.string().min(2).required(),
  noofdailyassesments: Joi.number().integer().positive().required()
});
const getCheckuserSchema = Joi.object({
  email: Joi.string().min(2).required()
});

const getCustomerBillingAddress = Joi.object({
    customerid: Joi.number().integer().positive().required(),
    cardtype: Joi.string().min(2).required(),
    cardno: Joi.string().min(2).required(),
    cardowner: Joi.string().min(2).required(),
    expirymonth: Joi.string().min(2).required(),
    expiryyear: Joi.string().min(2).required(),
    securityCode : Joi.number().integer().positive().required()
});


app.post('/api/customer', function(req, res) {
    const ret = Joi.validate(req.body, getCustomersSchema, {
    // return an error if body has an unrecognised property
    allowUnknown: false,
    // return all errors a payload contains, not just the first one Joi finds
    //abortEarly: false
    });
    if (ret.error) {
      res.status(400).json({
                status: 'error',
                message: ret.error.details[0].message
              });;
    }
    else
    {
          db.none('insert into customer(companyname)' +
            'values(${name})',
          req.body)
          .then(function () {
            res.status(200)
              .json({
                status: 'success',
                message: 'User Inserted Successfully!'
              });
          })
          .catch(function (err) {
            console.log(err);
            return err;
          });
    }
});
app.get('/api/customer/:userID', function(req, res) {
    var id = parseInt(req.params.userID);
//    db.one('SELECT CT.customerid,CT.id as contactid,companyname,name,CT.first_name as first_name,CT.last_name as last_name,addr1,addr2,city,state,country,zip,phone,email,ipaddress,plan,activated,expiredate,activedevices,instanceid,infrastructuresize,industrytype,complianceframework,infastructuretype,noofdailyassesments FROM customer CM RIGHT JOIN contact CT ON CT.customerid=CM.id JOIN preferences PS ON PS.customerid=CT.customerid WHERE CM.id= $1 LIMIT 1', id)
   db.one('select * from instances where customerid=$1', id)
      .then(function (data) {
        console.log("data",data)
        if(data)
        {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Userdetails Fetched'
          });
          }
          else
          {
           res.status(200)
          .json({
            status: 'failed',
            data: data,
            message: 'User Not Found'
          }); 
          }
      })
      .catch(function (err) {
        console.log("err",err)
        res.status(200)
          .json({
            status: 'failed',
            message: 'User Not Found'
          }); 
      });

  });

app.get('/api/ccinfo/:ccid', function(req, res) {
    var id = parseInt(req.params.ccid);
    db.one('select * from custbillinginfo where customerid=$1', id)
        .then(function (data) {
            console.log("data",data)
            if(data)
            {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Credit Card Fetched'
                    });
            }
            else
            {
                res.status(200)
                    .json({
                        status: 'failed',
                        data: data,
                        message: 'Credit Card Not Found'
                    });
            }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(200)
                .json({
                    status: 'failed',
                    message: 'Credit Card Not Found'
                });
        });

});

app.put('/api/editcustomer/:cusID', function(req, res) {
    var id = parseInt(req.params.cusID);
    var companyname = req.body.companyname;
    var contactid = req.body.contactid;
    var request = [req.body.name,req.body.addr1,req.body.addr2,req.body.city,req.body.state,req.body.country,req.body.zip,req.body.phone,req.body.first_name,req.body.last_name,contactid]
    var request_user = [req.body.first_name,req.body.last_name,req.body.email]
    db.tx(t => {
        return t.batch([
            t.none('UPDATE customer SET companyname=$1 WHERE id=$2',[companyname,id]),
            t.none('UPDATE contact SET name=$1,addr1=$2,addr2=$3,city=$4,state=$5,country=$6,zip=$7,phone=$8,first_name=$9,last_name=$10 WHERE id=$11', request),
            t.none('UPDATE users SET first_name=$1,last_name=$2 WHERE email=$3', request_user)
        ]);
    })
    .then(data => {
          res.status(200)
            .json({
              status: 'success',
              message: 'customer info Update Successfully!'
            });
        })
    .catch(function (err) {
          console.log(err);
          res.status(500)
            .json({
              status: 'failed',
              message: 'Internal Server Error'
            });
    });
    
  });

app.post('/api/preference', function(req, res) {
    const ret = Joi.validate(req.body, getpreferencesSchema, {
    // return an error if body has an unrecognised property
    allowUnknown: false,
    // return all errors a payload contains, not just the first one Joi finds
    //abortEarly: false
    });
    if (ret.error) {
      res.status(400).json({
                status: 'error',
                message: ret.error.details[0].message
              });;
    }
    else
    {
          db.none('insert into preferences(customerid,infrastructuresize,industrytype,complianceframework,infastructuretype,noofdailyassesments)' +
            'values(${customerid},${infrastructuresize},${industrytype},${complianceframework},${infastructuretype},${noofdailyassesments})',
          req.body)
          .then(function () {
            res.status(200)
              .json({
                status: 'success',
                message: 'preferences Created Successfully!'
              });
          })
          .catch(function (err) {
            console.log(err);
            res.status(500)
              .json({
                status: 'failed',
                message: 'Internal Server Error'
              });
      });
    }

  });


app.post('/api/ccinfo', function(req, res) {
    const ret = Joi.validate(req.body, getCustomerBillingAddress, {
        // return an error if body has an unrecognised property
        allowUnknown: false,
        // return all errors a payload contains, not just the first one Joi finds
        //abortEarly: false
    });
    if (ret.error) {
        res.status(400).json({
            status: 'error',
            message: ret.error.details[0].message
        });
    }
    else
    {

        db.none('insert into custbillinginfo (customerid,cardtype,cardno,cardowner,expirymonth,expiryyear,securitycode)' +
            'values(${customerid},${cardtype},${cardno},${cardowner},${expirymonth},${expiryyear},${securityCode})',
            req.body)
            .then(function () {
                res.status(200)
                    .json({
                        status: 'success',
                        message: 'Credit Card Info Saved Successfully!'
                    });
            })
            .catch(function (err) {
                console.log(err);
                res.status(500)
                    .json({
                        status: 'failed',
                        message: 'Internal Server Error'
                    });
            });
    }


});

app.post('/api/contact', function(req, res) {
    const ret = Joi.validate(req.body, getcontactSchema, {
    // return an error if body has an unrecognised property
    allowUnknown: false,
    // return all errors a payload contains, not just the first one Joi finds
    //abortEarly: false
    });
    if (ret.error) {
      res.status(400).json({
                status: 'error',
                message: ret.error.details[0].message
              });;
    }
    else
    {
          db.none('insert into contact(customerid,name,addr1,addr2,city,state,zip,phone,email)' +
            'values(${customerid},${name},${addr1},${addr2},${city},${state},${zip},${phone},${email})',
          req.body)
          .then(function () {
            res.status(200)
              .json({
                status: 'success',
                message: 'Contact Created Successfully!'
              });
          })
          .catch(function (err) {
            console.log(err);
            res.status(500)
              .json({
                status: 'failed',
                message: 'Internal Server Error'
              });
      });
    }


});

app.post('/api/launchinstance', function(req, res) {

  const exec = require('child_process').exec;
                var yourscript = exec('sh script.sh',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
                res.status(200)
                                .json({
                                  status: 'success',
                                  message: error
                                });
            }
            else
            {
                res.status(200)
                                .json({
                                  status: 'success',
                                  message: 'Launch Instance Triggered'
                                });
            }
        });


});

app.post('/api/provisioning', function(req, res) {

    /***********Verify Payment**************/
    // var hashSecretWord = 'MmJkZjdkZWUtM2Q2MC00MzJjLWIzOTctODg2ZDMyNDA3Y2Q0'; //2Checkout Secret Word
    // var hashSid = 901364802; //2Checkout account number
    // var hashTotal = req.body.total; //Sale total to validate against
    // var hashOrder = req.body.order_number; //2Checkout Order Number
    // var key= req.body.key;
    // var str = md5(hashSecretWord+hashSid+hashOrder+hashTotal);
    // console.log("KEYYY",str.toUpperCase())
    // console.log("Provision Data :"+JSON.stringify(req.body));
    // if(key==str.toUpperCase()){ // Key matching , successful payment.
    
    var hostURL = req.protocol+'://'+req.headers.host;
    console.log("Provision Data :"+JSON.stringify(req.body));
    var expirydays = req.body.expirydays  ;
    // Inserting Company Data and returning ID
    db.tx(t => {
        var today = new Date();
        var NewDate = new Date(today);
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        NewDate.setDate(NewDate.getDate() + expirydays);
        req.body.startdate = today.toISOString();
        req.body.enddate = NewDate.toISOString();

        req.body.status = 'Pending';

        return t.batch([
            t.none('insert into customer(companyname,salesforcecustomerid,status,created,serviceagreementaccepted)' +
            'values(${companyname},${salesforcecustomerid},${status},${startdate},${serviceagreementaccepted})',
          req.body),
            t.one('select id from customer where companyname = $1 order by id desc LIMIT 1', req.body.companyname)
        ]);
    })
    .then(data => {
      //Inserting Contact and Preferences data based on customer ID
      db.tx(t => {
        
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var oneyear_plus = new Date(year + 1, month, day)
        var n = d.toUTCString();
        var expired = oneyear_plus.toUTCString();
        req.body.customerid = data[1].id;
        req.body.productid = 1;
        req.body.vmcount = 100;
        req.body.containercount = 100;
        req.body.imagecount = 100;

        req.body.username = "administartor";
        req.body.created = n;
        req.body.activated = n;
        req.body.status = "Pending";
        req.body.expiredate = expired;
	req.body.showhelpscreen = "true";
        req.body.role = 'Admin';
        return t.batch([
            t.none('insert into contact(customerid,name,addr1,addr2,city,state,country,zip,phone,email,created)' +
            'values(${customerid},${name},${addr1},${addr2},${city},${state},${country},${zip},${phone},${email},${created})',
          req.body),
            t.none('insert into users (created,customerid,login,role,status,showhelpscreen)' +
         'values(${created},${customerid},${email},${role},${status},${showhelpscreen})',
       req.body),
            t.one("select nextval('entitlements_id_seq'::regclass) as id")
        ]);
        })
        .then(data => {
          var ent_id = data[2].id;
          req.body.entid = ent_id;
        db.tx(t => {
          return t.batch([
            t.none('insert into entitlements(id,productid,oppertunityid,startdate,enddate,subtype,vmcount,containercount,imagecount)' +
            'values(${entid},${productid},${oppertunityid},${startdate},${enddate},${subtype},${vmcount},${containercount},${imagecount})',
          req.body),
            t.none('update customer set entitlementid=($1) WHERE id=($2)',
        [ent_id,req.body.customerid])
        ]);
        })
        .then(data => {
          const exec = require('child_process').exec;
                var yourscript = exec('/var/lib/saas-provision-script '+req.body.email+' '+hostURL,
            (error, stdout, stderr) => {
                console.log(`${stdout}`);
                console.log(`${stderr}`);
               
            });
               // res.redirect('/app/success');
                //res.redirect("https://saas.cavirin.com/")
           res.status(200)
                  .json({
                    status: 'success',
                    message: 'Data Inserted Successfully!'
                  });

          })
        .catch(error => {
          console.log(error);
         res.status(500)
                  .json({
                    status: 'failed',
                    message: 'Internal Server Error'
                   });
        });
          
          // const exec = require('child_process').exec;
          //       var yourscript = exec('/var/lib/saas-provision-script '+req.body.email+' '+hostURL,
          //   (error, stdout, stderr) => {
          //       console.log(`${stdout}`);
          //       console.log(`${stderr}`);
               
          //   });
          //      // res.redirect('/app/success');
          //       //res.redirect("https://saas.cavirin.com/")
          //  res.status(200)
          //         .json({
          //           status: 'success',
          //           message: 'Data Inserted Successfully!'
          //         });
        })
        .catch(error => {
          console.log(error);
           res.status(500)
                  .json({
                    status: 'failed',
                    message: 'Internal Server Error'
                   });
        });
    })
    .catch(error => {
      console.log(error)
       res.status(500)
              .json({

                status: 'failed',
                message: 'Internal Server Error'
              });
    });
  // }
  // else
  // {
  //   res.redirect('/app/fail');
  // }


});


app.put('/api/updateip', function(req, res) {
  var email = req.query.email;
  var ip = req.query.ip;
  db.none('update contact set ipaddress=($1) WHERE email=($2)',
        [ip,email])
        .then(function () {
          res.status(200)
            .json({
              status: 'success',
              message: 'Contact Update Successfully!'
            });
        })
        .catch(function (err) {
          console.log(err);
          res.status(500)
            .json({
              status: 'failed',
              message: 'Internal Server Error'
            });
    });


});

app.post('/api/checkuser', function(req, res) {
    const ret = Joi.validate(req.body, getCheckuserSchema, {
    // return an error if body has an unrecognised property
    allowUnknown: false,
    // return all errors a payload contains, not just the first one Joi finds
    //abortEarly: false
    });
    if (ret.error) {
      res.status(400).json({
                status: 'error',
                message: ret.error.details[0].message
              });;
    }
    else
    {
      var email = req.body.email;
      console.log(email);
      db.one('select id from contact where email=$1 LIMIT 1', [email])
        .then(function (data) {

            res.status(200)
              .json({
                status: 'success',
                message: 'Userdetails Fetched'
              });
              
        })
        .catch(function (err) {
            res.status(500)
            .json({
              status: 'failed',
              message: 'Something went wrong'
            });
        });
      }

  });

app.get('/api/customers/:OFFSET?/:LIMIT?', function(req, res) {
  //console.log(req.headers.host)
  // console.log(parseInt(req.params.OFFSET))
  //   var offset = 5*parseInt(req.params.OFFSET);

    var where = '';
    var limit = '';
    var offset = '';
    var limit_cnt = 10;
    if(req.params.LIMIT && req.params.LIMIT!='')
    {
      limit_cnt = req.params.LIMIT;
      var limit = ' LIMIT '+limit_cnt;

    }
    if(req.params.OFFSET && req.params.OFFSET!='')
    {
       var offset_cnt = limit_cnt*parseInt(req.params.OFFSET);
       offset = ' OFFSET '+offset_cnt;

    }
    if(req.query.name && req.query.name!='')
    {
      where = " WHERE LOWER(companyname) LIKE  LOWER('%"+req.query.name+"%')";
    }
    db.any("SELECT count(*) OVER() AS full_count,companyname,salesforcecustomerid,oppertunityid,startdate as customer_startdate,enddate as customer_enddate,subtype,vmcount,containercount,imagecount,CM.status as customer_status,CT.*,COALESCE(I.status,'Pending') as instance_status,ES.id as entid,I.pulsarinstanceid as instanceid,I.ipaddress FROM customer CM LEFT JOIN entitlements ES ON ES.id=CM.entitlementid LEFT JOIN instances I on I.customerid=CM.id RIGHT JOIN contact CT ON CT.customerid=CM.id "+where+" order by CM.id desc"+limit+offset)
      .then(function (data) {
        if(data)
        {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Userdetails Fetched',
            totalcount: data[0].full_count
            //limit:5,
            //offset:offset
          });
        }
        else
        {
          res.status(200)
          .json({
            status: 'failed',
            data: data,
            message: 'No Data Found',
            limit:5,
            offset:offset
          });
        }
      })
      .catch(function (err) {
        console.log(err);
        //return next(err);
      });

  });

/* 
 * Add New user to customer 
 * @method : POST
 * @request(type json) : first_name,last_name,email
 * @response(type json) : {
 *                "status":"success"
 *               "message":"some message"
 *             }
 *
 */

app.post('/api/adduser', function(req, res) {
    //console.log(req.headers.host)
    var hostURL = req.headers.host
    var d = new Date();
    var n = d.toUTCString();
    const password_mail = passUnhash.decrypt(process.env.MAIL_PASSWORD);
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME, // generated ethereal user
            pass: password_mail  // generated ethereal password
        }
    });
    var admin_url = req.protocol+'://'+hostURL;
   console.log("ADMINURL",admin_url)
    var password = generator.generate({
    length: 10,
    numbers: true,
    uppercase: true,
    excludeSimilarCharacters : true,
    strict: true
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: process.env.MAIL_USERNAME, // sender address
        to: req.body.email, // list of receivers
        subject: 'Cavirin Account Created', // Subject line
        html: '<div>Hello '+req.body.first_name+' '+req.body.last_name+',<br/><br/>'
                +'Thank you for choosing Cavirin Security Risk Assessment Service. </br>'
                +'Cavirin security platform provides deployment flexibility, security risk evaluation, and comphrensive reporting.'
                +' It continually discovers new assets in your organization and analyzes existing ones for alignment to cloud, container, and regulatory benchmarks.'
                +'<br/><br/>'
                +'As per your request, a dedicated System has been provisioned for you to assess your organization’s assets.'
                +'Please '
                +'<a href=\"' + admin_url + '/app/login\">' +' click here </a>'
                +'to access admin portal. '+'<br/>'
                +'<b>Username</b> : '+req.body.email+'<br/>'
                +'<b>Password</b> : '+password+'<br/>'
                +'<br/><br/>'
                +'Thank you.<br/><br/>'
                +'Cavirin security team.'
                +'</div>' // html body
    };
    req.body.username = "administartor";
    req.body.password = password;
    
    req.body.created = n;
    req.body.status = 'Active';
    db.one('select id from users where email=$1 LIMIT 1', [req.body.email])
        .then(function (data) {
            res.status(200)
            .json({
            status: 'warning',
            message: 'Email Id already exsist'
            });
  
        })
        .catch(function (err) {
            if (err instanceof QRE && err.code === qrec.noData) {
                db.none('insert into users(first_name,last_name,username,email,password,created,status,customerid)' +
                  'values(${first_name},${last_name},${username},${email},${password},${created},${status},${customerid})',
                req.body)
                .then(function () {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            res.status(200)
                              .json({
                                status: 'failed',
                                message: 'Mail Send failed'
                              });
                        }
                        else
                        {
                            res.status(200)
                            .json({
                              status: 'success',
                              message: 'User Created Successfully!'
                            });
                        }

                    
                     });
                  
                })
                .catch(function (err) {
                    console.log(err);
                    res.status(500)
                      .json({
                        status: 'failed',
                        message: 'Internal Server Error'
                      });
                });
          }
          else
          {
             res.status(500)
                .json({
                  status: 'failed',
                  message: 'Internal Server Error'
                });
          }


 
        });
    


});
/* 
 * Edit User Details 
 * @method : PUT
 * @request(type json) : first_name,last_name,email
 * @response(type json) : {
 *                "status":"success"
 *               "message":"some message"
 *             }
 * @request_uri : http://localhost:3000/api/edituser/<USERID>
 *
 */
app.put('/api/edituser/:userID', function(req, res) {
    var d = new Date();
    var n = d.toUTCString();
    var userid = parseInt(req.params.userID);
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var username = first_name + last_name;
    var email = req.body.email;
    var created = req.body.created = n;
    var status = req.body.status = req.body.status;
    var request_str = [first_name,last_name,username,email,created,status,userid]
    db.none('UPDATE users SET first_name=($1),last_name=($2),username=($3),email=($4),created=($5),status=($6) WHERE id=($7)',request_str)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'User Details Updated Successfully!'
          });
      })
      .catch(function (err) {
        console.log(err);
        res.status(500)
          .json({
            status: 'failed',
            message: 'Internal Server Error'
          });
  });
    


});


app.put('/api/editccinfo/:ccid', function(req, res) {
    var ccid = parseInt(req.params.ccid);
    var cardtype = req.body.cardtype;
    var cardno = req.body.cardno;
    var cardowner = req.body.cardowner;
    var expiryDate = req.body.expiryDate;
    var securityCode = req.body.securityCode;
    var request_str = [ccid,cardtype,cardno,cardowner,expiryDate,securityCode];
    db.none('UPDATE custbillinginfo SET cardtype=($2),cardno=($3),cardowner=($4),expiryDate=($5),securityCode=($6) WHERE id=($1)',request_str)
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Credit Card Details Updated Successfully!'
                });
        })
        .catch(function (err) {
            console.log(err);
            res.status(500)
                .json({
                    status: 'failed',
                    message: 'Internal Server Error'
                });
        });

});
/* 
 * Delete User Details 
 * @method : DELETE
 * @response(type json) : {
 *                "status":"success"
 *               "message":"some message"
 *             }
 * @request_uri : http://localhost:3000/api/deleteuser/<USERID>
 *
 */
app.delete('/api/deleteuser/:userID', function(req, res) {
    var userid = parseInt(req.params.userID);
    db.result('delete from users where id = $1', userid)
      .then(function (result) {
        /* jshint ignore:start */
        res.status(200)
          .json({
            status: 'success',
            message: 'user removed Successfully!!'
          });
        /* jshint ignore:end */
      })
      .catch(function (err) {
        console.log(err);
        res.status(500)
          .json({
            status: 'failed',
            message: 'Internal Server Error'
          });
      });
});


app.delete('/api/deleteccinfo/:ccid', function(req, res) {
    var userid = parseInt(req.params.ccid);
    db.result('delete from custbillinginfo where id = $1', userid)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Credit info removed Successfully!!'
                });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            console.log(err);
            res.status(500)
                .json({
                    status: 'failed',
                    message: 'Internal Server Error'
                });
        });
});
/* 
 * Delete Multiple User Details 
 * @method : DELETE
 * @response(type json) : {
 *                "status":"success"
 *               "message":"some message"
 *             }
 * @request_uri : http://localhost:3000/api/deleteuser/<USERID>
 *
 */
app.post('/api/deleteusers', function(req, res) {
    var userid = req.body.userid;
    //userid = userid.toString();
    db.result('delete from users where id IN('+userid+')')
      .then(function (result) {
        
        res.status(200)
          .json({
            status: 'success',
            message: 'users removed Successfully!!'
          });
       
      })
      .catch(function (err) {
        console.log(err);
        res.status(500)
          .json({
            status: 'failed',
            message: 'Internal Server Error'
          });
      });
});

/* 
 * Single User Details 
 * @method : GET
 * @response(type json) : {
 *                "status":"success"
 *                "message":"some message"
                  "data":USERDATA
 *             }
 * @request_uri : http://localhost:3000/api/user/<USERID>
 *
 */
app.get('/api/user/:userID', function(req, res) {
  console.log("test");
    var userid = parseInt(req.params.userID);
    db.one('select id,first_name,last_name,email,created,lastlogin,status,username from users where id = $1', userid)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'user fetched Successfully!!!'
        });
    })
    .catch(function (err) {
      console.log(err);
        if (err instanceof QRE && err.code === qrec.noData) {
          console.log("USER LOGIN ERROR: email "+email+ " error message "+err.message)
          res.status(200)
              .json({
                status: 'failed',
                message: 'User Not Found'
              });
        } else {
          console.log("USER LOGIN ERROR: email "+email+ "error message "+err)
          res.status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error'
          });
        }
    });
});

/*
 * Login Api
 * @method : POST
 * @request(type json) : email,password
 * @response(type json) : {
 *               "status":"success"
 *               "message":"some message"
 *             }
 */

app.post('/api/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var status = "Active";
    var d = new Date();
    var n = d.toUTCString();
    db.one('select id,customerid,role,resetpassword,showhelpscreen from users where login = $1 and password= $2 and status=$3', [email,password,status])
    .then(function (data) {
      console.log("USER LOGIN SUCCESS: email "+email)
      db.none('UPDATE users SET lastlogin=$1 WHERE id=$2', [n,data.id])
        .then(function (data1) {
        console.log(data1 + "data 1");
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'User fetched Successfully!!!'
            });

          })
        .catch(function (err) {
                console.log(err);
                 res.status(500)
                .json({
            status: 'error',
            message: 'Internal Server Error 2'
          });
        });

    })
    .catch(function (err) {
      console.log("ERROR",err);
       if (err instanceof QRE && err.code === qrec.noData) {
          console.log("USER LOGIN ERROR: email "+email+ " error message "+err.message)
          res.status(200)
              .json({
                status: 'failed',
                message: 'Username or Password wrong'
              });
        } else {
          console.log("USER LOGIN ERROR: email "+email+ "error message "+err)
          res.status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error 3'
          });
        }
    });
});


/* 
 * Suspend a User 
 * @method : PUT
 * @response(type json) : {
 *                "status":"success"
 *               "message":"some message"
 *             }
 * @request_uri : http://localhost:3000/api/suspenduser/<USERID>
 *
 */
app.put('/api/suspenduser/:userID', function(req, res) {
    var userid = parseInt(req.params.userID);
    db.none("UPDATE users SET status='Suspended' WHERE id=($1)",userid)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'User Created Successfully!'
          });
      })
      .catch(function (err) {
        console.log(err);
        res.status(500)
          .json({
            status: 'failed',
            message: 'Internal Server Error'
          });
  });
    


});

/* 
 * Suspend Multiple User Account
 * @method : PUT
 * @response(type json) : {
 *                "status":"success"
 *               "message":"some message"
 *             }
 * @request_uri : http://localhost:3000/api/suspenduser/<USERID>
 *
 */
app.put('/api/suspendusers', function(req, res) {
    var userid = req.body.userid;
    userid = userid.toString();
    db.none("UPDATE users SET status='Suspended' WHERE id IN ("+userid+")")
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'User Status Updated Successfully!'
          });
      })
      .catch(function (err) {
        console.log(err);
        res.status(500)
          .json({
            status: 'failed',
            message: 'Internal Server Error'
          });
  });
    


});
/* 
 * Get all Users under one customer 
 * @method : GET
 * @response(type json) : {
 *                "status":"success"
 *                "message":"some message"
                  "data":USERDATA
 *             }
 * @request_uri : http://localhost:3000/api/users/<USERID>
 *
 */
app.get('/api/users/:customerID', function(req, res) {
  console.log("test");
    var customerID = parseInt(req.params.customerID);
    var userID = parseInt(req.params.userId);
    db.any('select * from contact where customerid = $1', [customerID])
    .then(function (data) {
      console.log(data);
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'users fetched Successfully!!!'
        });
    })
    .catch(function (err) {
      console.log(err);
        if (err instanceof QRE && err.code === qrec.noData) {
          
          res.status(200)
              .json({
                status: 'failed',
                message: 'Users Not Found'
              });
        } else {
          console.log("USER LOGIN ERROR: email "+email+ "error message "+err)
          res.status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error'
          });
        }
    });
});

/* 
 * check Wheter a user is already exsist 
 * @method : POST
 * @request(type json) : email
 * @response(type json) : {
 *                "status":"success"
 *                "message":"some message"
                  "data":USERDATA
 *             }
 *
 */
app.post('/api/checkuserid', function(req, res) {
    const ret = Joi.validate(req.body, getCheckuserSchema, {
    // return an error if body has an unrecognised property
    allowUnknown: false,
    // return all errors a payload contains, not just the first one Joi finds
    //abortEarly: false
    });
    if (ret.error) {
      res.status(400).json({
                status: 'error',
                message: ret.error.details[0].message
              });;
    }
    else
    {
      var email = req.body.email;
      console.log(email);
      db.one('select id from users where login=$1 LIMIT 1', [email])
        .then(function (data) {

            res.status(200)
              .json({
                status: 'success',
                message: 'Userdetails Fetched'
              });
              
        })
        .catch(function (err) {
          console.log(err)
        if (err instanceof QRE && err.code === qrec.noData) {
          
          res.status(200)
              .json({
                status: 'failed',
                message: 'User Not Found'
              });
        } else {
          console.log("USER LOGIN ERROR: email "+email+ "error message "+err)
          res.status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error'
          });
        }
        });
      }

  });

/* 
 * Update User Status From Admin side 
 * @method : PUT
 * @request(type json) : customerid,status("Active","Inactive","Suspended")
 * @response(type json) : {
 *                status: 'success',
                  message: 'User Status Updated Successfully!'
 *             }
 *
 */
app.put('/api/customerstatus', function(req, res) {
    var customerid = req.body.customerid;
    var status = req.body.status;
    //userid = userid.toString();
    db.none("UPDATE users SET status='"+status+"' WHERE customerid IN ("+customerid+")")
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'User Status Updated Successfully!'
          });
      })
      .catch(function (err) {
        console.log(err);
        res.status(500)
          .json({
            status: 'failed',
            message: 'Internal Server Error'
          });

  });

});


/*
 * Update Plan details from admin side
 * @method : PUT
 * @request(type json) : plan,subtype,enddate,customerid
 * @response(type json) : {
 *                status: 'success',
                  message: 'Customer plan  Updated Successfully!'
 *             }
 *
 */
app.put('/api/plan', function(req, res) {
    var entid = req.body.entid;
    var set_customer = ' companyname=companyname,';
    var set_contact = ' SET name=name,';
    var set_entitlements = ' productid=productid,';
    if(req.body.plan)
    {
      set_contact = set_contact + " plan='"+req.body.plan+"',"
    }
    if(req.body.subtype)
    {
      set_customer = set_customer + " subtype='"+req.body.subtype+"',"
      set_entitlements = set_entitlements + " subtype='"+req.body.subtype+"',"
    }
     if(req.body.enddate)
    {
      set_customer = set_customer + " enddate='"+req.body.enddate +"',"
      set_entitlements = set_entitlements + " enddate='"+req.body.enddate +"',"
    }
    if(set_customer!='')
    {
      set_customer = " SET "+set_customer;
    }
    if(set_entitlements!='')
    {
      set_entitlements = " SET "+set_entitlements;
    }
    set_customer = set_customer.replace(/,\s*$/, "");
    set_entitlements = set_entitlements.replace(/,\s*$/, "");
    set_contact = set_contact.replace(/,\s*$/, "");
    // var plan = req.body.plan;
    // var subtype = req.body.subtype;
    // var enddate = req.body.enddate;
    //userid = userid.toString();

var customerid = req.body.customerid;
var enddate = req.body.enddate;

        console.log(set_entitlements);

    db.tx(t => {


        return t.batch([
            t.none('UPDATE entitlements '+set_entitlements+' WHERE id=$1',[entid]),
                t.none('DELETE FROM schedule WHERE customerid = $1',[customerid])
           // t.none('UPDATE customer '+set_customer+' WHERE id=$1',[customerid])
        ]);
    })
    .then(data => {
        expiryDateExtended(customerid,enddate)
        res.status(200)
          .json({
            status: 'success',
            message: 'Plan Details Updated Successfully!'
          });
      })
      .catch(function (err) {
        console.log(err);
        res.status(500)
          .json({
            status: 'failed',
            message: 'Internal Server Error'
          });

  });

});



function expiryDateExtended(customerid,enddate)
{
 var today = new Date();
     pool.connect(function(err, pgclient, done) {
         if (err) return console.log(err);
         var queryThirteen = 'INSERT INTO schedule (created,customerid,scheduleddate,action,emailtype) VALUES ($1,$2,$3,$4,$5);';
         pgclient.query(queryThirteen,[today,customerid,enddate,'deprovisioning','stop'], function(err, result) {
             done();
             if (err) console.log(err);
         });
});

     pool.connect(function(err, pgclient, done) {
         if (err) return console.log(err);

console.log(enddate);

    var d = new Date(enddate);

d.setDate(d.getDate() + 30);

console.log(d);

         var query = 'INSERT INTO schedule (created,customerid,scheduleddate,action,emailtype) VALUES ($1,$2,$3,$4,$5);';
         pgclient.query(query,[today,customerid,d,'deprovisioning','terminate'], function(err, result) {
             done();
             if (err) console.log(err);
         });
});


}


app.get('/api/updateScript', function(req, res) {
  
var filePath = path.resolve("../scripts/test");

  const exec = require('child_process').exec;
  var yourscript = exec(filePath,
      (error, stdout, stderr) => {
          
          console.log(`${stdout}`);
          console.log(`${stderr}`);
          res.end("<b>ls displayes files in your directory</b></br>"+stdout+"</br>");
         
      }); 

});

/*
 * Deprovisioning API
 * @method : POST
 * @request(type json) : instanceIP ,action
 * @response(type json) : {
 *               "status":"success"
 *               "message":"some message"
 *             }
 */

app.post('/api/deprovisioning', function(req, res) {

var customerid = req.body.customerid;
//var instanceIp = req.body.instanceIp;
var action = req.body.action;
db.tx(t => {
        var today = new Date();
        var NewDate = new Date(today);
        NewDate.setDate(NewDate.getDate() + 30);
        req.body.startdate = today.toUTCString();
        req.body.enddate = NewDate.toUTCString();
        if(req.body.action=='terminate')
        {
          action = "Terminated"
        }
        else if(req.body.action=='stop')
        {
          action = "Stopped"
        }
        else if(req.body.action=='restart')
        {
          action = "Restarted"
        }
        else
        {
          action = req.body.action;
        }
        
        return t.batch([
            t.none('UPDATE instances SET status=$1 WHERE customerid=$2',[action,customerid]),
            t.one('select pulsarinstanceid from instances where customerid = $1 LIMIT 1', customerid)
        ]);
    })
    .then(data => {
            const exec = require('child_process').exec;
            if(req.body.action=='restart')
            {
              var yourscript = exec('/var/lib/start-instance-script '+data[1].pulsarinstanceid,
                (error, stdout, stderr) => {
                    console.log(`${stdout}`);
                    console.log(`${stderr}`);
                });
            }
            else
            {
          var yourscript = exec('/var/lib/saas-deprovision-script '+data[1].pulsarinstanceid+' '+req.body.action+' '+customerid,
                (error, stdout, stderr) => {
                    console.log(`${stdout}`);
                    console.log(`${stderr}`);
                });
            }
            
               res.status(200)
                      .json({
                        status: 'success',
                        message: 'Deprovisioing Successfully!'
                      });
           
              
        })
        .catch(function (err) {
          console.log(err)
        if (err instanceof QRE && err.code === qrec.noData) {
          
          res.status(200)
              .json({
                status: 'failed',
                message: 'User Not Found'
              });
        } else {
          console.log("USER LOGIN ERROR: email "+email+ "error message "+err)
          res.status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error'
          });
        }
        });
  
});

/*
 * Update Password Api
 * @method : PUT
 * @request(type json) : email,currentPassword,updatedPassword
 * @response(type json) : {
 *               "status":"success"
 *               "message":"some message"
 *             }
 */


app.post('/api/login/updatePassword', function(req, res) {
console.log("inside Update password");
   var email = req.body.email;
    var currentPassword = req.body.currentPassword;
    var updatedPassword  = req.body.updatedPassword;
    var d = new Date();
    var n = d.toUTCString();
        if(currentPassword == updatedPassword){
        res.status(400)
            .json({
              status: 'error',
              message: 'New Password Same as Previous Password'
            });
        }
        else{
    db.one('select id,customerid,role from users where login = $1 and password= $2', [email,currentPassword])
    .then(function (data) {
      console.log("USER LOGIN SUCCESS: email "+email)
        db.none('UPDATE users SET password=$1,resetpassword=$3 WHERE id=$2', [updatedPassword,data.id,'false'])
        .then(function (data1) {
                        db.one('select serviceagreementaccepted from customer where id = $1', [data.customerid])
                .then(function (data2) {
db.one('SELECT contact.name, instances.ipaddress FROM contact,instances WHERE contact.customerid = instances.customerid AND contact.customerid = $1', [data.customerid])
                .then(function (datacontact) {
                        console.log("USER LOGIN SUCCESS: IP "+datacontact.ipaddress);
                        console.log("USER LOGIN SUCCESS: IP "+datacontact.name);
        var name = datacontact.name.split(" ");
        var firstName = name[0];
        var lastName = name[1];
                       const exec = require('child_process').exec;
                        var yourscript = exec('/var/lib/add-user-script '+datacontact.ipaddress+' '+email+' '+updatedPassword+' '+firstName+' '+lastName,
                        (error, stdout, stderr) => {

          console.log(`${stdout}`);
          console.log(`${stderr}`);
        userActivatesFifteenDays(data.customerid)
          res.status(200)
            .json({
              status: 'success',
              data: data,
              dataServiceAgreement: data2.serviceagreementaccepted,
              message: 'Password Updated Successfully!!!',
              userData: `${stdout}`
            });
                        });
        })
        .catch(function (err) {
          res.status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error'
          });
        })
})
        .catch(function (err) {
          res.status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error1'
          });
        })
    })
        .catch(function (err) {
          res.status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error2'
          });
        })
})
        .catch(function (err) {
          res.status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error 3'
          });
        })
}
});




function userActivatesFifteenDays(id)
{
/*
Remove De provisioning from Scheduler
Email Notification after 7 days
Email Notification after 13 days
De-provisioning after 15 days
*/
console.log("INSIDE userActivatesFifteenDays");
console.log(id);
var customerId = id;
     pool.connect(function(err, pgclient, done) {
         if (err) return console.log(err);

 var today = new Date();

        var queryenddate = 'select entitlements.enddate from entitlements JOIN customer ON customer.entitlementid = entitlements.id WHERE customer.id =$1;';
         pgclient.query(queryenddate,[customerId], function(err, result) {
             done();
             if (err) console.log(err);
                else var endDate =  result.rows[0].enddate;
                console.log("End Date "+endDate);

var endDateTwo = result.rows[0].enddate;

       var queryFifteen = 'INSERT INTO schedule (created,customerid,scheduleddate,action,emailtype) VALUES ($1,$2,$3,$4,$5);';
         pgclient.query(queryFifteen,[today,customerId,endDate,'deprovisioning','stop'], function(err, result) {
             done();
             if (err) console.log(err);
         });

var triggerdate = {};
triggerdate.endDate = endDate;
var twoday = endDate;
console.log(triggerdate);
twoday.setDate(twoday.getDate() - 2);
console.log("twoday "+twoday);
var s = twoday;
triggerdate.twoday = twoday;

        var querydeletethree = 'DELETE FROM schedule WHERE customerid = $1 AND emailtype = $2;';
         pgclient.query(querydeletethree,[customerId,'terminate'], function(err, result) {
             done();
             if (err) console.log(err);
         });

console.log(triggerdate);
        var queryThirteen = 'INSERT INTO schedule (created,customerid,scheduleddate,action,emailtype) VALUES ($1,$2,$3,$4,$5);';
         pgclient.query(queryThirteen,[today,customerId,triggerdate.twoday,'email','xMinusTwo'], function(err, result) {
             done();
             if (err) console.log(err);
         });
console.log(triggerdate);


});

     });

     pool.connect(function(err, pgclient, done) {
         if (err) return console.log(err);

 var today = new Date();

        var queryenddate = 'select entitlements.enddate from entitlements JOIN customer ON customer.entitlementid = entitlements.id WHERE customer.id =$1;';
         pgclient.query(queryenddate,[customerId], function(err, result) {
             done();
             if (err) console.log(err);
                else var endDate =  result.rows[0].enddate;
                console.log("End Date "+endDate);

var endDateTwo = result.rows[0].enddate;


var triggerdate = {};
triggerdate.endDate = endDate;
var sevenday = endDateTwo;
console.log(triggerdate);

sevenday.setDate(sevenday.getDate() - 7);
console.log("sevenday "+sevenday);
triggerdate.sevenday = sevenday;

         var queryThirteen = 'INSERT INTO schedule (created,customerid,scheduleddate,action,emailtype) VALUES ($1,$2,$3,$4,$5);';
         pgclient.query(queryThirteen,[today,customerId,triggerdate.sevenday,'email','xMinusSeven'], function(err, result) {
             done();
             if (err) console.log(err);
         });
console.log(triggerdate);

});

     });


     pool.connect(function(err, pgclient, done) {
         if (err) return console.log(err);

 var today = new Date();

        var queryenddate = 'select entitlements.enddate from entitlements JOIN customer ON customer.entitlementid = entitlements.id WHERE customer.id =$1;';
         pgclient.query(queryenddate,[customerId], function(err, result) {
             done();
             if (err) console.log(err);
                else var endDate =  result.rows[0].enddate;
                console.log("End Date "+endDate);

var endDateTwo = result.rows[0].enddate;


var triggerdate = {};
triggerdate.endDate = endDate;
var sevenday = endDateTwo;
console.log(triggerdate);

sevenday.setDate(sevenday.getDate() + 30);
console.log("sevenday "+sevenday);
triggerdate.sevenday = sevenday;

         var queryThirteen = 'INSERT INTO schedule (created,customerid,scheduleddate,action,emailtype) VALUES ($1,$2,$3,$4,$5);';
         pgclient.query(queryThirteen,[today,customerId,triggerdate.sevenday,'deprovisioning','terminate'], function(err, result) {
             done();
             if (err) console.log(err);
         });
console.log(triggerdate);
});
});



}






/*
 * Update Password Api
 * @method : PUT
 * @request(type json) : email,currentPassword,updatedPassword
 * @response(type json) : {
 *               "status":"success"
 *               "message":"some message"
 *             }
 */


app.post('/api/login/updatePasswordOld', function(req, res) {
    var email = req.body.email;
    var currentPassword = req.body.currentPassword;
    var updatedPassword  = req.body.updatedPassword;
    var d = new Date();
    var n = d.toUTCString();
        if(currentPassword == updatedPassword){
        res.status(400)
            .json({
              status: 'error',
              message: 'New Password Same as Previous Password'
            });
        }
        else{
    db.one('select id,customerid,role from users where login = $1 and password= $2', [email,currentPassword])
    .then(function (data) {
      console.log("USER LOGIN SUCCESS: email "+email)
        db.none('UPDATE users SET password=$1,resetpassword=$3 WHERE id=$2', [updatedPassword,data.id,'false'])
        .then(function (data1) {
            db.one('select ipaddress from instances where customerid = $1', [data.customerid])
                .then(function (datacontact) {
                        console.log("USER LOGIN SUCCESS: IP "+datacontact.ipaddress);
                        const exec = require('child_process').exec;
                        var yourscript = exec('/var/lib/add-user-script '+datacontact.ipaddress+' '+email+' '+updatedPassword,
                        (error, stdout, stderr) => {

          console.log(`${stdout}`);
          console.log(`${stderr}`);
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Password Updated Successfully!!!',
              userData: `${stdout}`
            });
      });

    })
          })
        .catch(function (err) {
          res.status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error'
          });
        })
    })
}
});




/*
 * Api for get Subscription Details
 * @method : GET
 * @request(type json) : productId
 * @response(type json) : {
 *               "status":"success",
 *               "data":data,
 *               "message":"some message"
 *             }
 */

app.get('/api/getSubscriptionDetailsByUser/:ccid', function(req, res) {
    var id = parseInt(req.params.ccid);
    db.one('select entitlementid from customer where id = $1', id)
        .then(function (data) {
            console.log("data",data)
            if(data)
            {
        db.one('select * from entitlements where id = $1', data.entitlementid)
        .then(function (dataSubType) {
            console.log("data",dataSubType.subtypes)
            if(data)
            {
                res.status(200)
                    .json({
                        status: 'success',
                        data: dataSubType,
                        message: 'Subscription Data'
                    });
            }
            else
            {
                res.status(400)
                    .json({
                        status: 'failed',
                        data: data,
                        message: 'No Subscription Data for User Available'
                    });
            }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'No Subscription Data for User Availabl'
                });
        });
        }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'No Subscription Data for User Availabl'
                });
        });


});



/*
 *sub type API from customer ID
 *
 * Api for get sub type API from customer ID
 * @method : GET
 * @request(type json) : customerid
 * @response(type json) : {
 *               "status":"success",
 *               "data":data,
 *               "message":"some message"
 *             }
 */


app.get('/api/getSubType/:ccid', function(req, res) {
    var id = parseInt(req.params.ccid);
    db.one('select entitlementid from customer where id = $1', id)
        .then(function (data) {
            console.log("data",data)
            if(data)
            {
        db.one('select subtypes from entitlements where id = $1', data.entitlementid)
        .then(function (dataSubType) {
            console.log("data",dataSubType.subtypes)
            if(data)
            {
                res.status(200)
                    .json({
                        status: 'success',
                        data: dataSubType,
                        message: 'Subscription Data'
                    });
            }
            else
            {
                res.status(400)
                    .json({
                        status: 'failed',
                        data: data,
                        message: 'No Subscription Data for User Available'
                    });
            }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'No Subscription Data for User Availabl'
                });
        });
        }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'No Subscription Data for User Availabl'
                });
        });

});





/*
 * Api for get SAASAdmin Log
 * @method : GET
 * @request(type json) : customerid
 * @response(type json) : {
 *               "status":"success",
 *               "data":data,
 *               "message":"some message"
 *             }
 */

app.get('/api/logs/:cusID', function(req, res) {
    var customerid = req.params.cusID;
    var where = '';
    if(req.query.str && req.query.str!='')
    {
      where = where + " and LOWER(action) LIKE LOWER('%"+req.query.str+"%')"
    }
    db.any('SELECT action FROM sassadminlog WHERE customerid=$1 '+where+' order by id desc',customerid)
      .then(function (data) {

        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Logs Fetched Successfully!!',

          });

      })
      .catch(function (err) {
        console.log(err);
        res.status(200)
          .json({
            status: 'failed',
            message: 'Something went wrong!',

          });
      });

  });

/*
 *Trial end date API from customer ID
 * @method : GET
 * @request(type json) : customerid
 * @response(type json) : {
 *               "status":"success",
 *               "data":data,
 *               "message":"some message"
 *             }
 */

app.get('/api/getExpDate/:ccid', function(req, res) {
    var id = parseInt(req.params.ccid);
    db.one('select entitlementid from customer where id = $1', id)
        .then(function (data) {
            console.log("data",data)
            if(data)
            {
        db.one('select enddate from entitlements where id = $1', data.entitlementid)
        .then(function (dataSubType) {
            console.log("data",dataSubType.subtypes)
            if(data)
            {
                res.status(200)
                    .json({
                        status: 'success',
                        data: dataSubType,
                        message: 'Subscribtion Expiration Date Data'
                    });
            }
            else
            {
                res.status(400)
                    .json({
                        status: 'failed',
                        data: data,
                        message: 'No Subscription Data for User Available'
                    });
            }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'No Subscription Data for User Availabl'
                });
        });
        }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'No Subscription Data for User Availabl'
                });
        });

});



/*
 *Get Instance Status API from customer ID
 */
/*
 *Get Instance Status API from customer ID
 * @method : GET
 * @request(type json) : customerid
 * @response(type json) : {
 *               "status":"success",
 *               "data":data,
 *               "message":"some message"
 *             }
 */

app.get('/api/getInstanceStatus/:ccid', function(req, res) {
    var id = parseInt(req.params.ccid);
    db.one('select * from instances where customerid = $1', id)
        .then(function (data) {
            console.log("data",data)
            if(data)
            {
                getPulsarUserInfo(data,id,res)
           }
            else
            {
                res.status(400)
                    .json({
                        status: 'failed',
                        data: data,
                        message: 'No Subscription Instance Status Data for User Available'
                    });
            }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'No Subscription Instance Status Data for User Availabl'
                });
        });

});


function getPulsarUserInfo(data,id,res){
var customerId = id;

console.log("inside getPulsarUserInfo");
console.log(data);

pool.connect(function(err, pgclient, done) {
         if (err) return console.log(err);
        var queryGetIp = 'select * from users WHERE customerid =$1;';
         pgclient.query(queryGetIp,[customerId], function(err, result) {
             done();
             if (err) console.log(err);
                else var username =  result.rows[0].login;
                //console.log("ipaddress "+ipaddress);
var password = result.rows[0].password;
console.log("2");
//var username = email;
console.log(username);
var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");;
console.log(auth);
console.log(data);
  let fetch = require('node-fetch');
 // let AuthStr = 'Basic '+auth;
  axios.post('https://'+data.ipaddress+'/arap-server/api/v0/login', {},{ headers: {'Content-Type':'application/x-www-form-urlencoded', Authorization: auth } })
    .then(function (response) {
    console.log(response.data);
          res.status(200)
            .json({
              status: 'success',
              data: data,
              pulsarUserdata: response.data,
              message: 'User fetched Successfully!!!'
            });
  }).catch(err => {
     console.log(err);
  });
})
        });
}





app.get('/api/Maintenance/', function(req, res) {
    var Maintenance = "maintenance";
    db.any('select * from schedule where action = $1', Maintenance)
        .then(function (data) {
            console.log("data",data)
            if(data)
            {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Subscription Instance Status Data'
                    });
            }
            else
            {
                res.status(400)
                    .json({
                        status: 'failed',
                        data: data,
                        message: 'NO Upcoming Maintenance '
                    });
            }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'No Subscription Instance Status Data for User Availabl'
                });
        });

});


/* API TO EDIT serviceagreementaccepted */

app.put('/api/serviceagreementaccepted/:cusID', function(req, res) {
    var id = parseInt(req.params.cusID);
    var serviceagreementaccepted = req.body.serviceagreementaccepted;
    db.tx(t => {
        return t.batch([
            t.none('UPDATE customer SET serviceagreementaccepted=$1 WHERE id=$2',[serviceagreementaccepted,id])
        ]);
    })
    .then(data => {
          res.status(200)
            .json({
              status: 'success',
              message: 'customer info Update Successfully!'
            });
        })
    .catch(function (err) {
          console.log(err);
          res.status(500)
            .json({
              status: 'failed',
              message: 'Internal Server Error'
            });
    });

  });


app.put('/api/toggleHelpscreen/:cusID', function(req, res) {
    var id = parseInt(req.params.cusID);
    var toggleHelpscreen = req.body.toggleHelpscreen;
console.log(toggleHelpscreen);
    db.tx(t => {
        return t.batch([
            t.none('UPDATE users SET showhelpscreen=$1 WHERE customerid=$2',[toggleHelpscreen,id])
        ]);
    })
    .then(data => {
          res.status(200)
            .json({
              status: 'success',
              message: 'customer info Update Successfully!'
            });
        })
    .catch(function (err) {
          console.log(err);
          res.status(500)
            .json({
              status: 'failed',
              message: 'Internal Server Error'
            });
    });

  });
app.post('/api/getToken', function(req, res) {
  var auth = req.body.auth;
  var ipaddress = req.body.ipaddress;
  let fetch = require('node-fetch');
  let AuthStr = 'Basic '+auth;

  axios.post('https://'+ipaddress+'/arap-server/api/v0/login', {},{ headers: {'Content-Type':'application/x-www-form-urlencoded', Authorization: AuthStr } })
    .then(function (response) {
    console.log(response.data);
    res.status(200)
            .json({
              status: 'success',
              data:response.data,
              message: 'Access Token Generated'
            });
    
  }).catch(err => {
     console.log(err);
     res.status(500)
            .json({
              status: 'failed',
              message: 'Internal Server Error'
            });

  });

});


app.get('/api/name/:cusID', function(req, res) {
    var id = parseInt(req.params.cusID);
    db.any('select name from contact where customerid = $1', id)
        .then(function (data) {
            console.log("data",data)
            if(data)
            {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'user name Data'
                    });
            }
            else
            {
                res.status(400)
                    .json({
                        status: 'failed',
                        data: data,
                        message: 'NO user found'
                    });
            }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'No User Data for User Availabl'
                });
        });

});


app.get('/api/eula/:cusID', function(req, res) {
    var id = parseInt(req.params.cusID);
    db.any('select * from customer where id = $1', id)
        .then(function (data) {
            console.log("data",data)
            if(data)
            {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Subscription Instance Status Data'
                    });
            }
            else
            {
                res.status(400)
                    .json({
                        status: 'failed',
                        data: data,
                        message: 'NO Upcoming Maintenance '
                    });
            }
        })
        .catch(function (err) {
            console.log("err",err)
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'No Subscription Instance Status Data for User Availabl'
                });
        });

});



var cron = require('node-cron');

var cron = require('node-cron');
const Redis = require('redis');
const redisClient = Redis.createClient();
var publisher = Redis.createClient();


app.post('/api/redis', function(req, res, next) {
    console.log("inside monitoring");
    var jsonredis = {"message":req.body.message,"email":req.body.email,"name":req.body.name};
    var publisher  = Redis.createClient();
    var myJSON = JSON.stringify(jsonredis);
    publisher.publish("notifyScheduler", myJSON);
    res.json({
        "response":"API hit "
    });
});




var task = cron.schedule('0 0 0 * * *', function() {
  console.log('Cron started');
var today = new Date();
today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
console.log(today);
var todayPlusOne = new Date(today.getFullYear(), today.getMonth(), today.getDate());
todayPlusOne.setDate(todayPlusOne.getDate() + 1);
console.log(todayPlusOne);
    db.any('select * from schedule where scheduleddate::date >= $1 AND scheduleddate::date < $2;', [today,todayPlusOne])
        .then(function (data) {
            if(data)
            {
console.log(data.length);
for(var i = 0; i < data.length ; i++){
console.log("**********************START*********");
   console.log("i -- >> "+i);
let action = data[i].action;
let emailtype = data[i].emailtype;
let customerid = data[i].customerid;
console.log(action);
console.log(emailtype);
console.log(customerid);
if(action ==='deprovisioning')
{
console.log("inside deprovisioning case"+ action);
console.log("i -- >> "+i);
        db.one('select pulsarinstanceid from instances where customerid=$1', customerid)
        .then(function (datainstances) {
            console.log("data",datainstances)
            if(datainstances)
            {
        console.log("from deprovisioning - > "+action);
        console.log("from deprovisioning - > "+emailtype);
updateInstanceStatus(emailtype,customerid,i)
            const exec = require('child_process').exec;
              var yourscript = exec('/var/lib/saas-deprovision-script '+datainstances.pulsarinstanceid+' '+emailtype+' '+customerid,
                 (error, stdout, stderr) => {
                    console.log(`${stdout}`);
                    console.log(`${stderr}`);
                });
//updateInstanceStatus(emailtype,customerid,i)

            }
            else
            {
                console.log("inside Error");
            }
        })
        .catch(function (err) {
            console.log("err",err)
          });
}
if(action ==='email')
{
console.log("inside email");
console.log("i -- >> "+i);
            db.one('SELECT contact.name, users.login FROM contact,users WHERE contact.customerid = users.customerid AND contact.customerid = $1', data[i].customerid)
        .then(function (dataEmail) {
            console.log("data",dataEmail.login)
            if(dataEmail)
            {
                console.log(dataEmail.login);
                    var jsonredis = {"message":emailtype,"email":dataEmail.login,"name":dataEmail.name};
                var publisher  = Redis.createClient();
                var myJSON = JSON.stringify(jsonredis);
                publisher.publish("notifyScheduler", myJSON);
            }
            else
            {
                console.log("No Email");
             }
        })
        .catch(function (err) {
            console.log("err",err)
        });
}

}
console.log("******** FINAL ****************");
            }
            else
            {
                console.log("no notification to show");
            }
        })
        .catch(function (err) {
            console.log("err",err)
        });

}, false);

task.start();


function updateInstanceStatus(actionn,customerid,i)
{
console.log("inside updateInstanceStatus");
console.log(actionn);
console.log(customerid);
console.log(" i -- >> "+i);
   var id = parseInt(customerid);
        if(actionn==='terminate')
        {
          actionn = "Terminated";
    db.tx(t => {
        return t.batch([
            t.none('UPDATE instances SET status=$1 WHERE customerid=$2',[actionn,customerid])
        ]);
    })
    .then(data => {
        console.log(data);
console.log("*******************END*****");

        })
    .catch(function (err) {
          console.log(err);
    });
        }
        if(actionn==='stop')
        {
          actionn = "Stopped";
    db.tx(t => {
        return t.batch([
            t.none('UPDATE instances SET status=$1 WHERE customerid=$2',[actionn,customerid])
        ]);
    })
    .then(data => {
        console.log(data);
console.log("*******************END*****");

        })
    .catch(function (err) {
          console.log(err);
    });
        }
}









// start the server
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});
