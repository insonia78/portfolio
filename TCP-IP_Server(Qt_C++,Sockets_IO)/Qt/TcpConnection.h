

#ifndef TCPCONNECTION_H
#define TCPCONNECTION_H

#include <QObject>
#include <QDebug>
#include <QTcpSocket>
#include "MessagesType.h"
#include "DbConnector.h"
#include "ProcessRequest.h"
#include "SessionsDb.h"
#include "glpkLock.h"
#include <QThread>
class TcpConnection: public QObject {
    Q_OBJECT
public:    
    explicit TcpConnection(QObject *parent = 0);
    virtual ~TcpConnection();
    virtual void setSocket(QTcpSocket *socket,QThread *m_thread);
    void setDbConnector(glpkLock* glpk,DbConnector *dbConnector, SessionsDb * sessions);
    void setConnectionId(int id);
private:
    QTcpSocket *m_socket;
    QTcpSocket *getSocket();
    QThread *m_thread;
    ProcessRequest *request;
    QString response;
    QString test;
    int bytes = 0 ;
    int connectionId = 0;
    QString resp;
signals:
    void sigTcpDataReceived(QString);
public slots:
    virtual void connected();
    virtual void disconnected();
    virtual void ReadyRead(QString data);
    virtual void readyRead();
    virtual void bytesWritten(qint64 _bytes);
    virtual void stateChanged(QAbstractSocket::SocketState _socketState);
    virtual void error(QAbstractSocket::SocketError _socketError);
    void CollectingData();
};

#endif /* TCPCONNECTION_H */
