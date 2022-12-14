

#ifndef TCPCONNECTIONS_H
#define TCPCONNECTIONS_H

#include <QObject>
#include <QDebug>
#include <QThread>
#include <QTcpSocket>
#include <QMap>
#include <QReadWriteLock>
#include "TcpConnection.h"
class TcpConnections : public QObject {
    Q_OBJECT
public:    
    TcpConnections(QObject *parent = 0);
    virtual ~TcpConnections();
    virtual int count();
private:
    QMap<QTcpSocket*,TcpConnection*> m_connections;
    void removeSocket(QTcpSocket *socket);
signals:
    void quitting();
    void finished();
protected slots:
    void disconnected();
    void error(QAbstractSocket::SocketError socketError);
public slots:
    
    void start();
    void quit();
    void accept(qintptr handle,TcpConnection *connection);
};

#endif /* TCPCONNECTIONS_H */

