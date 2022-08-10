

#include "TcpServer.h"

TcpServer::TcpServer(QObject *parent):QTcpServer(parent)
{
    qDebug() << this << " created on " << QThread::currentThread();
    database = new DbConnector(this);
    sessions = new SessionsDb(this);
    glpk = new glpkLock(this);    
    
}

TcpServer::~TcpServer() 
{
    qDebug() << this << " destroyed";
}

bool TcpServer::listening(const QHostAddress &address, quint16 port)
{
    if(!this->listen(address,port))
       return false;
    
    m_thread = new QThread(this);
    m_connections = new TcpConnections();
    connect(m_thread,&QThread::started,m_connections,&TcpConnections::start,Qt::QueuedConnection);
    connect(this,&TcpServer::accepting,m_connections,&TcpConnections::accept,Qt::QueuedConnection);
    connect(this,&TcpServer::finished,m_connections,&TcpConnections::quit,Qt::QueuedConnection);
    connect(m_connections,&TcpConnections::finished,this,&TcpServer::complete,Qt::QueuedConnection);
    m_connections->moveToThread(m_thread);
    m_thread->start();
    return true;
}
void TcpServer::close()
{
    qDebug() << this << " closing server";
    emit finished();
    QTcpServer::close();
}
qint64 TcpServer::port()
{
    if(isListening())
    {
        return this->serverPort();
    }
    return 1000;
    
}
void TcpServer::incomingConnection(qintptr decriptor)
{
    qDebug() << this << " attempting to accept connection " << decriptor;
    TcpConnection *connection = new TcpConnection();
    connection->setDbConnector(glpk,database,sessions);
    
    this->accept(decriptor,connection);
}
void TcpServer::accept(qintptr decriptor, TcpConnection *connection)
{
    qDebug() << this << "accepting connection " << decriptor;
    connection->moveToThread((m_thread));
    emit accepting(decriptor,connection);
}
void TcpServer::complete()
{
    if(!m_thread)
    {
        qWarning() << this << " exiting complete there was not thread";
        return;
    }
    
    qDebug() << this << " Complete called, destroyed thread";
    delete m_connections;
    qDebug() << this << " Quitting thread";
    m_thread->quit();
    m_thread->wait();
    
    delete m_thread;
    qDebug() << this << " complete";
}

