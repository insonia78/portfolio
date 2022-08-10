
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
#include <QFile>
using namespace sql;
#ifndef DCONNECTOR_H
#define DCONNECTOR_H

class DbConnector : public QObject {
    Q_OBJECT    
public:
    DbConnector(QObject *parent = 0);
    virtual ~DbConnector();
    sql::ResultSet * performQuery(std::string query,std::string schema);
    sql::Connection * getCon(std::string schema,sql::Connection *);
    void getConTest(std::string schema,sql::Connection *,int *);
    sql::Connection * getAlternativeAnalysisCon(std::string schema,sql::Connection *);
    sql::Connection * getProductionCostCon(std::string schema,sql::Connection *);
    sql::Connection * getStorageBenefitsCon(std::string schema,sql::Connection *);
    sql::Connection * getEmulatorCon(std::string schema,sql::Connection *);
    QFile *file ;
    QReadWriteLock lock;    

private:
   
    sql::Driver *driver;
    sql::Driver *adriver;
    sql::Driver *pdriver;
    sql::Driver *sdriver;
    sql::Driver *edriver;
    sql::ResultSet *res;
    
   
    int TRUE = 1;
    int FALSE = 0;
    int *canLock = &TRUE;
    int canLockAlternativeAnalysis = 1;
    int canLockProductionCost = 1;
    int canLockStorageBenefits = 1;
    int canLockEmulator = 1;

};

#endif /* DCONNECTOR_H */

