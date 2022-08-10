

#include "SessionsDb.h"

SessionsDb::SessionsDb(QObject *parent):QObject(parent)
{
    driver = get_driver_instance();
}
SessionsDb::~SessionsDb()
{
    
}
sql::Connection * SessionsDb::getCon(std::string schema,sql::Connection *con) {
    
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
