#!/bin/bash

export PGPASSWORD='admin'
INPUTFILE="DBScriptsList.txt"
OUTPUTFILE="DBoutput.txt"
ERRORFILE="DBerror.txt"
DBLOGFILE="DBlog.txt"

# remove existing output and error files if any
if [[ -e $ERRORFILE ]]; then
   rm -f $ERRORFILE
fi
if [[ -e $OUTPUTFILE ]]; then
   rm -f $OUTPUTFILE
fi
if [[ -e $DBLOGFILE ]]; then
   rm -f $DBLOGFILE
fi

touch "$OUTPUTFILE"
touch "$DBLOGFILE"

psql -h localhost -d postgres -U postgres -w -q -f All_Sequence_Schema.sql &>> $DBLOGFILE
#echo "Sequence created successfully"

psql -h localhost -d postgres -U postgres -w -q -f All_Tables_Schema.sql &>> $DBLOGFILE
#echo "Table created successfuly"

result=$(grep -i "ERROR:" "$DBLOGFILE")

  if [ ! -z "$result" ]; then
   echo "Error found in Loading DB Tables. Please see $DBLOGFILE for details"
   exit -1
  fi

id=`sudo PGPASSWORD="admin" psql -h localhost -p 5432 -U postgres -d postgres -Atc "select nextval('product_id_seq'::regclass);"`

salesforceprodutid='demosalesforceproductid'

query="insert into product(id,salesforceprodutid,name,price,sku) values ($id,'$salesforceprodutid','demoproductname', 5000.00, 'testsku')"

sudo PGPASSWORD="admin" psql -h localhost -p 5432 -U postgres -d postgres -c "$query"


