

#ifndef SESSIONHANDLER_H
#define SESSIONHANDLER_H
#include "SessionsDb.h"
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QDebug>
#include "MessagesType.h"
#include <QObject>
#include <QCoreApplication>
#include <QTime>
class SessionHandler:public QObject {
    Q_OBJECT
public:
    SessionHandler(QObject *parent,SessionsDb * sessionHandler);
    virtual ~SessionHandler();
    int ValidateSessionWithPort(QJsonObject jsonDocument);
    int StoreSession(QJsonObject jsonDocument);
    int DeleteSessionByToken(QString _token);
    int StorePortToSession(QJsonObject jsonDocument);
    
private:
  int FALSE = 0;
  int TRUE = 1;
  int *tryLockingSessions = &FALSE;
  QString reqIp;
  QString username;
  QString token;
  int port;
  SessionsDb * sessions;
  QJsonDocument *data;
  sql::Connection *con = NULL;
 
  sql::PreparedStatement  *prep_stmt;
  int64_t currentTime;
};

#endif /* SESSIONHANDLER_H */

