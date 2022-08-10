

#include "TcpConnection.h"
#include "ProcessRequest.h"
#include <QJsonDocument>
#include <QJsonArray>

TcpConnection::TcpConnection(QObject *parent) : QObject(parent) {
    qDebug() << this << "Connected";
}

TcpConnection::~TcpConnection() {
    qDebug() << this << "Destroyed";
}

void TcpConnection::setSocket(QTcpSocket *socket,QThread *thread) {
    qDebug() << "setting socket";
    m_socket = socket;
    m_thread = thread;
    m_socket->setSocketOption(QAbstractSocket::KeepAliveOption, 1);
    connect(m_socket, &QTcpSocket::connected, this, &TcpConnection::connected);
    connect(m_socket, &QTcpSocket::disconnected, this, &TcpConnection::disconnected);
    //connect(m_socket, &QTcpSocket::readyRead, this, &TcpConnection::);
    connect(m_socket, &QTcpSocket::readyRead, this, &TcpConnection::readyRead);
    connect(m_socket, &QTcpSocket::bytesWritten, this, &TcpConnection::bytesWritten);
    connect(m_socket, &QTcpSocket::stateChanged, this, &TcpConnection::stateChanged);
    //connect(this, &TcpConnection::sigTcpDataReceived, this, &TcpConnection::ReadyRead);
    connect(m_socket, static_cast<void (QTcpSocket::*)(QAbstractSocket::SocketError)> (&QTcpSocket::error), this, &TcpConnection::error);

}

QTcpSocket* TcpConnection::getSocket() {
    if (!sender())
        return 0;
    return static_cast<QTcpSocket*> (sender());
}

void TcpConnection::CollectingData() {
    if (m_socket->waitForReadyRead(2000)) {        
        while (m_socket->bytesAvailable() > 0) {
            resp.append(m_socket->readLine());
        }
        emit sigTcpDataReceived(resp);
    } else {
        qWarning() << "Waiting for data to read timed out. No data received !";
    }
}

void TcpConnection::ReadyRead(QString response) {
    if (!sender()) {
        qDebug() << this << "readyRead false";
        return;
    }
    QJsonDocument jsonResponse = QJsonDocument::fromJson(response.toUtf8());
    QJsonObject jsonObject = jsonResponse.object();
    qDebug() << this << " Setting Id";
    request->setId(connectionId);
    QString a = request->performRequest(jsonObject).toUtf8();
    m_socket->write(a.toUtf8());
    m_socket->waitForBytesWritten();
    m_socket->close();
    delete request;

}
void TcpConnection::readyRead() {
    if (!sender()) {
        qDebug() << this << "readyRead false";
        return;
    }
    response = m_socket->readAll();
    QJsonDocument jsonResponse = QJsonDocument::fromJson(response.toUtf8());
    QJsonObject jsonObject = jsonResponse.object();
    request->setId(connectionId);
    QString a = request->performRequest(jsonObject).toUtf8();
    m_socket->write(a.toUtf8());
    m_socket->waitForBytesWritten();
    m_socket->close();
    delete request;

}
void TcpConnection::connected() {
    if (!sender())
        return;
    qDebug() << this << "connected" << getSocket();
    ;
}

void TcpConnection::disconnected() {
    if (!sender())
        return;
    qDebug() << this << "disconnected:" << getSocket();
}
void TcpConnection::setConnectionId(int id) {
    connectionId = id;
    qDebug() << this << "setting Connection:" << getSocket();
}

void TcpConnection::bytesWritten(qint64 _bytes) {
    qDebug() << this << "bytesWritten:" << getSocket() << " number:" << _bytes;
}

void TcpConnection::stateChanged(QAbstractSocket::SocketState _socketState) {
    qDebug() << this << "stateChanged:" << getSocket() << " state:" << _socketState;
}

void TcpConnection::error(QAbstractSocket::SocketError _socketError) {
    qDebug() << this << "error:" << getSocket() << " error:" << _socketError;
}

void TcpConnection::setDbConnector(glpkLock* glpk,DbConnector * dbConnector, SessionsDb *sessions) {
    request = new ProcessRequest(this,glpk, dbConnector, sessions);
}