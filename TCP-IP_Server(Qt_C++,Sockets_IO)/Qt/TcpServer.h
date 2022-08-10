

#ifndef TCPSERVER_H
#define TCPSERVER_H
#include <QObject>
#include <QDebug>
#include <QTcpServer>
#include <QThread>
#include <TcpConnections.h>
#include <TcpConnection.h>
#include "DbConnector.h"
#include "SessionsDb.h"
#include "glpkLock.h"
class TcpServer : public QTcpServer
{
    Q_OBJECT
public:
    explicit TcpServer(QObject *parent = 0);
    virtual ~TcpServer();
    
    virtual bool listening(const QHostAddress &address, quint16 port);
    virtual void close();
    virtual qint64 port();
    DbConnector *database;
    SessionsDb  *sessions;
    glpkLock    *glpk;
protected:
    QThread *m_thread;
    TcpConnections *m_connections;
    void incomingConnection(qintptr socketDescriptor) Q_DECL_OVERRIDE;;
    virtual void accept(qintptr decriptor, TcpConnection *connection);
signals:
    void accepting(qintptr handle, TcpConnection *connection);
    void finished();
public slots:
    void complete();
        

    
        
private:

};

#endif /* TCPSERVER_H */

