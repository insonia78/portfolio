
#include <QObject>
#include <QDebug>
//#include <log4cxx/propertyconfigurator.h>
//#include <log4cxx/logger.h>
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/driver.h>
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>
#include "mysql_driver.h"
#include "mysql_connection.h"
#include <QReadWriteLock>
#ifndef SESSIONSDB_H
#define SESSIONSDB_H

class SessionsDb : public QObject {
    Q_OBJECT
public:
    SessionsDb(QObject *parent);    
    virtual ~SessionsDb();
    sql::Connection * getCon(std::string schema,sql::Connection *);
    QReadWriteLock lock;    
   
    sql::Driver *driver;
    sql::ResultSet *res;
    
     
    int canLock = 1;


};

#endif /* SESSIONSDB_H */

