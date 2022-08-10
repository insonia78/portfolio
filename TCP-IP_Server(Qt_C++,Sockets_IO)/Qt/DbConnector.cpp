

#include "DbConnector.h"
int TRUE = 1;
DbConnector::DbConnector(QObject *parent) : QObject(parent) {
    driver = get_driver_instance();
    adriver = get_driver_instance();
    pdriver = get_driver_instance();
    sdriver = get_driver_instance();
    edriver = get_driver_instance();
    file = new QFile("/home/gonzales1609/IRENA/dbLog.txt");
    if (!file->open(QIODevice::Append | QIODevice::Text))
        return;


}
void DbConnector::getConTest(std::string schema,sql::Connection * con,int *a)
{
    qDebug() << this << "checking lock";
    lock.lockForRead();
    qDebug() << this << "inside Lock";    
    con  = driver->connect("localhost:3306", "acelerex", "@acelerex!123");
    con->setSchema(schema);
     qDebug() << this << " a " << *a;
    if(con == NULL)
        qDebug() << "con is NULL";
    a = &TRUE;
    qDebug() << this << " a " << *a;
    lock.unlock();
}
sql::Connection * DbConnector::getCon(std::string schema,sql::Connection * con) {
    
    qDebug() << this << "checking lock";
    lock.lockForRead();
    qDebug() << this << "inside Lock";    
    con  = driver->connect("localhost:3306", "acelerex", "@acelerex!123");
    con->setSchema(schema);
    if(con == NULL)
        qDebug() << "con is NULL";
    lock.unlock();
    return con;
   
}
sql::Connection * DbConnector::getAlternativeAnalysisCon(std::string schema,sql::Connection * con) {
    
    qDebug() << this << "checking lock";
    lock.lockForRead();
    qDebug() << this << "inside Lock";    
    con  = adriver->connect("localhost:3306", "acelerex", "@acelerex!123");
    con->setSchema(schema);
    if(con == NULL)
        qDebug() << "con is NULL";
    lock.unlock();
    return con;
   
}
sql::Connection * DbConnector::getProductionCostCon(std::string schema,sql::Connection * con) {
    
    qDebug() << this << "checking lock";
    lock.lockForRead();
    qDebug() << this << "inside Lock";    
    con  = pdriver->connect("localhost:3306", "acelerex", "@acelerex!123");
    con->setSchema(schema);
    if(con == NULL)
        qDebug() << "con is NULL";
    lock.unlock();
    return con;
   
}
sql::Connection * DbConnector::getStorageBenefitsCon(std::string schema,sql::Connection * con) {
    
    qDebug() << this << "checking lock";
    lock.lockForRead();
    qDebug() << this << "inside Lock";    
    con  = sdriver->connect("localhost:3306", "acelerex", "@acelerex!123");
    con->setSchema(schema);
    if(con == NULL)
        qDebug() << "con is NULL";
    lock.unlock();
    return con;
   
}
sql::Connection * DbConnector::getEmulatorCon(std::string schema,sql::Connection * con) {
    
    qDebug() << this << "checking lock";
    lock.lockForRead();
    qDebug() << this << "inside Lock";    
    con  = edriver->connect("localhost:3306", "acelerex", "@acelerex!123");
    con->setSchema(schema);
    if(con == NULL)
        qDebug() << "con is NULL";
    lock.unlock();
    return con;
   
}
DbConnector::~DbConnector() {
}

 

    




