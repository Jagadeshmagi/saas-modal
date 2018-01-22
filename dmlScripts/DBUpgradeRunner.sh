#!/bin/bash

export PGPASSWORD='admin'
DBLOGFILE="DBlog.txt"
LIQUIBASELOG="Liquibase.txt"

# remove existing output and error files if any
if [[ -e $DBLOGFILE ]]; then
   rm -f $DBLOGFILE
fi
rm -f "/var/lib/cavirin_saas/dmlScripts/Liquibase.txt"
touch "$LIQUIBASELOG"
touch "$DBLOGFILE"


(cd /var/lib/cavirin_saas/dmlScripts; java -jar liquibase.jar --changeLogFile=db.changelog.xml update &>> $LIQUIBASELOG)
liquibaseresult=$(grep -i "Error:" "$LIQUIBASELOG")
if [ ! -z "$liquibaseresult" ]; then
   echo "Problem with Liquibase. Please check Liquibase.txt";
fi





