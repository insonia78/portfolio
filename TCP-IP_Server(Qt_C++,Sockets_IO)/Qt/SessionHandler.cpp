

#include "SessionHandler.h"

SessionHandler::SessionHandler(QObject *parent,SessionsDb * sessions ):QObject(parent) {
    this->sessions = sessions;
   
}
SessionHandler::~SessionHandler() {
}

int SessionHandler::StorePortToSession(QJsonObject jsonObject) {
    qDebug() << this << " >> STORING PORT TO SESSION";
    port = jsonObject["port"].toString().toInt();
    token = jsonObject["token"].toString();
    reqIp = jsonObject["reqIp"].toString();
     

    try {
        int count;
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              
          }
          con = sessions->getCon("credentials",con);
          count++;
        }   
        std::string query = "UPDATE Sessions SET port = ? where token = ? AND ip =?";
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setInt(1, port);
        prep_stmt->setString(2, token.toStdString());
        prep_stmt->setString(3, reqIp.toStdString());
        prep_stmt->execute();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        
        delete prep_stmt;
        delete con;
        return ERR_REQUEST_QUERY;
    }
    delete prep_stmt;
    delete con;
    return SUCCESS_REQUEST;
}

int SessionHandler::DeleteSessionByToken(QString _token) {
     
    qDebug() << this << " << DELETING SESSION By TOKEN";
    
    try {
        int count;
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              
          }
          con = sessions->getCon("credentials",con);
          count++;
        }
        std::string query = "DELETE from Sessions where token = ?";
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, _token.toStdString());
        prep_stmt->execute();

    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete con;
        delete prep_stmt;
        
        return ERR_REQUEST_QUERY;
    }
    delete con;
    delete prep_stmt;
    
    return SUCCESS_REQUEST;
}
int SessionHandler::StoreSession(QJsonObject jsonObject) {
    currentTime = ((QDateTime::currentMSecsSinceEpoch() / 1000) + 8640);
    reqIp = jsonObject["reqIp"].toString();
    username = jsonObject["username"].toString();
    token = jsonObject["token"].toString();
    int count;
     
    
    qDebug() << this << ">> STORING SESSION";
    try {
        while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              
          }
          con = sessions->getCon("credentials",con);
          count++;
        }
        
        
        std::string query = "SELECT * from Sessions where username = ?";
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, username.toStdString());
        if (prep_stmt->executeQuery()->next()) {
            qDebug() << this << " >> DELITING SESSION";
            delete prep_stmt;
            query = "DELETE from Sessions where username = ?";
            prep_stmt = con->prepareStatement(query.c_str());
            prep_stmt->setString(1, username.toStdString());
            prep_stmt->execute();
            prep_stmt->~PreparedStatement();
        }
        qDebug() << this << " >> CREATING SESSION";
        query = "INSERT INTO Sessions(username,token,timeStamp,ip) \
                          VALUES(?,?,?,?)";
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, username.toStdString());
        prep_stmt->setString(2, token.toStdString());
        prep_stmt->setInt(3, currentTime);
        prep_stmt->setString(4, reqIp.toStdString());
        prep_stmt->execute();
        
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        
        return ERR_REQUEST_QUERY;
    }
    
    return SUCCESS_REQUEST;
}
int SessionHandler::ValidateSessionWithPort(QJsonObject jsonObject) {

    qDebug() << this << " >> VALIDATING SESSION";
    currentTime = (QDateTime::currentMSecsSinceEpoch() / 1000);
    reqIp = jsonObject["reqIp"].toString();
    username = jsonObject["username"].toString();
    token = jsonObject["token"].toString();
    qDebug() << "token:" << token;
    port = jsonObject["port"].toInt();
    
    std::string _username;
    std::string _ip;
    int64_t _timeStamp;
    int _port;
    try {
        int count;
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              
          }
          con = sessions->getCon("credentials",con);
          count++;
        }    
        std::string query = "SELECT * from Sessions where token = ?";
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, token.toStdString());
        sql::ResultSet *res = prep_stmt->executeQuery();


        if (!res->next()) {
           
            qDebug() << this << " >> NO TOKEN";
            qDebug() << this << "token :" << token;
            return ERR_INVALID_SESSION;
        }
        _username = res->getString("username");
        _ip = res->getString("ip");
        _timeStamp = res->getInt64("timeStamp");
        _port = res->getInt("port");

        if (QString::compare(username, QString::fromStdString(_username)) != 0) {
            qDebug() << this << " >> DIFFERENT USERNAME";
            qDebug() << username << ":" << QString::fromStdString(_username);
            DeleteSessionByToken(token);
            return ERR_INVALID_SESSION;
        }
        if (QString::compare(reqIp, QString::fromStdString(_ip)) != 0) {
            qDebug() << this << " >> DIFFERENT IP";
            qDebug() << reqIp << ":" << QString::fromStdString(_ip);
            DeleteSessionByToken(token);
            return ERR_INVALID_SESSION;
        }
        if (_port != port) {
            qDebug() << this << " >> DIFFERENT PORT";
            qDebug() << _port << ":" << port;
            DeleteSessionByToken(token);
            return ERR_INVALID_SESSION;
        }
        if (_timeStamp <= currentTime) {
            qDebug() << this << " >> DIFFERENT TIMESTAMP";
            qDebug() << _timeStamp << ":" << currentTime;
            DeleteSessionByToken(token);
            return ERR_EXPIRED_SESSION;
        }
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        
        delete con;
        delete prep_stmt;
        return ERR_REQUEST_QUERY;
    }
    delete con;
    delete prep_stmt;
   
    return SUCCESS_REQUEST;

}
