

#include "ProcessRequest.h"
#include "ProductionCostNoESS.h"
#include <QChar>
#include <QFile>
ProcessRequest::ProcessRequest(QObject *parent,glpkLock* glpk,DbConnector *_dbConnector, SessionsDb * sessions) : QObject(parent) {
    this->dbConnector = _dbConnector;
    this->sessions = new SessionHandler(this, sessions);
    this->glpk = glpk;
    qDebug() << this << " ProcessRequest >> processing";
   
}

ProcessRequest::~ProcessRequest() {
   
    qDebug() << this << "ProcessRequest >> deleting";
}
void ProcessRequest::setId(int id)
{
    qDebug() << this << " setting id " << id;
    identifierId = id;
    identifier = QString("ProcessRequest_").append(QString::number(id));
    qDebug() << this << " identifier " << identifier;
   
}
QString ProcessRequest::removeRun(QJsonObject jsonObject) {
    qDebug() << this << " REMOVING RUN";
    try {
        
        std::string _username = jsonObject["username"].toString().toStdString();
        std::string _scenario = jsonObject["scenario"].toString().toStdString();
        std::string _case = jsonObject["case"].toString().toStdString();
        std::string query = "SELECT row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?";
        
        while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
        
        qDebug() << QString::fromStdString(_username);
        qDebug() << QString::fromStdString(_scenario);
        qDebug() << QString::fromStdString(_case);
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, _username);
        prep_stmt->setString(2, _scenario);
        prep_stmt->setString(3, _case);
        sql::ResultSet *res = prep_stmt->executeQuery();
        while (res->next()) {
            delete prep_stmt;
            int64_t row_id = res->getInt64("row_id");
            std::string delete_query("DELETE FROM scenarios_and_cases WHERE  row_id = ?");
            prep_stmt = con->prepareStatement(delete_query.c_str());
            prep_stmt->setInt(1, row_id);
            prep_stmt->execute();
            delete prep_stmt;
            DeleteProject(row_id);

        }
        delete con;
        delete res;
        
        jsonObject.insert("response", processMessage(SUCCESS_REQUEST));
        qDebug() << this <<  QString::fromStdString(_scenario) << QString::fromStdString(_case) << " REMOVED";
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        if (prep_stmt != NULL)
            delete prep_stmt;
        delete con;
        jsonObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " removeRun " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    }

}

QString ProcessRequest::removeProject(QJsonObject jsonObject) {
    qDebug() << this << " REMOVING PROJECT";
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    try {
        
        std::string username = jsonObject["username"].toString().toStdString();
        std::string scenario = jsonObject["scenario"].toString().toStdString();
        std::string query = "SELECT row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ?";
       
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, username);
        prep_stmt->setString(2, scenario);
        sql::ResultSet *res = prep_stmt->executeQuery();
        delete prep_stmt;
        while (res->next()) {
            int64_t row_id = res->getInt64("row_id");
            std::string delete_query("DELETE FROM scenarios_and_cases WHERE  row_id = ?");
            prep_stmt = con->prepareStatement(delete_query.c_str());
            prep_stmt->setInt(1, row_id);
            prep_stmt->execute();
            delete prep_stmt;
            DeleteProject(row_id);
        }
        delete con;
        jsonObject.insert("response", processMessage(SUCCESS_REQUEST));
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        if (prep_stmt != NULL)
            delete prep_stmt;
        delete con;
        jsonObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << "removeProject " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    }


}

QString ProcessRequest::performRequest(QJsonObject jsonObject) {

    qDebug() << jsonObject["request"].toString() + " for >> " + jsonObject["reqIp"].toString();
    QStringList request = jsonObject["request"].toString().split(":");
    switch (request[0].toInt()) {
        case REQ_PROJECTS_AND_RUNS: //8000
        {
            /*
            int status = sessions->ValidateSessionWithPort(jsonObject);
            if (status < SUCCESS_REQUEST) {
                QJsonObject response;
                response.insert("response", processMessage(status));
                data = new QJsonDocument(response);
                return data->toJson();
            }*/
            return getProjects_Runs(jsonObject);

        }
        case REQ_CREDENTIAL_VALIDATION://8001
        {
            return credentialValidation(jsonObject);
        }
        case REQ_SAVE_DATA://8002
        {
            /*
            int status = sessions->ValidateSessionWithPort(jsonObject);
            if (status < SUCCESS_REQUEST) {
                QJsonObject response;
                response.insert("response", processMessage(status));
                data = new QJsonDocument(response);
                return data->toJson();
            }*/
            return SaveData(jsonObject);
        }
        case REQ_SESSION_CLOSE://8003
        {
            qDebug() << this << " >> REQ_SESSION_CLOSE ";
            int status = sessions->DeleteSessionByToken(jsonObject["token"].toString());
            QJsonObject response;
            if(status < SUCCESS_REQUEST)
            {               
                response.insert("response", processMessage(status));
                data = new QJsonDocument(response);
                return data->toJson();
            }            
            response.insert("response", processMessage(status));
            data = new QJsonDocument(response);
            return data->toJson();
        }
        case REQ_ALTERNATIVE_ANALYSIS_CALCULATION://8004
        {
            qDebug() << this << " >> REQ_ALTERNATIVE_ANALYSIS_CALCULATION ";
            return StartAlternativeAnalysisCalculation(jsonObject);
        }
        case REQ_DELETE_PROJECT://8005
        {
            /*
            int status = sessions->ValidateSessionWithPort(jsonObject);
            if (status < SUCCESS_REQUEST) {
                QJsonObject response;
                response.insert("response", processMessage(status));
                data = new QJsonDocument(response);
                return data->toJson();
            }*/
            qDebug() << "REQ_DELETE_PROJECT";
            return removeProject(jsonObject);
        }
        case REQ_DELETE_RUNS://8006
        {
            /*
            int status = sessions->ValidateSessionWithPort(jsonObject);
            if (status < SUCCESS_REQUEST) {
                QJsonObject response;
                response.insert("response", processMessage(status));
                data = new QJsonDocument(response);
                return data->toJson();
            }*/
            qDebug() << "REQ_DELETE_RUNS";
            return removeRun(jsonObject);
        }
        case REQ_GET_RUN_DATA://8007
        {
            /* 
            int status = sessions->ValidateSessionWithPort(jsonObject);
            if (status < SUCCESS_REQUEST) {
                QJsonObject response;
                response.insert("response", processMessage(status));
                data = new QJsonDocument(response);
                return data->toJson();
            }*/
            return getCaseData(jsonObject);
        }
        case REQ_SET_SESSION_PORT: //8008
        {
            /*
            int status = sessions->ValidateSessionWithPort(jsonObject);
            if (status < SUCCESS_REQUEST) {
                QJsonObject response;
                response.insert("response", processMessage(status));
                data = new QJsonDocument(response);
                return data->toJson();
            }*/
            QJsonObject response;
            response.insert("response", processMessage(sessions->StorePortToSession(jsonObject)));
            data = new QJsonDocument(response);
            return data->toJson();
        }
        case REQ_FORCE_SAVE_DATA: //8009
        {
            return ForceSave(jsonObject);
        }
        case REQ_ALTERNATIVE_ANALYSIS_DATA: //8010
        {
            return getAlternativeAnalysisData(jsonObject);
        }
        case REQ_VARIABLE_COST_CALCULATION: //8011
        {
            qDebug() << this << " >> StartVariableCostCalculation";
            return StartProductionCostCalculation(jsonObject);
        }
        case REQ_VARIABLE_COST_DATA: //8012
        {
            return getProductionCostData(jsonObject);
        }
        case REQ_STACKED_BENEFITS_CALCULATION: // 8013
        {
            qDebug() << this << " >> StartStackedBenefitsCalculation";
            return StartStackedBenefitsCalculation(jsonObject);
        }
        case REQ_STACKED_BENEFITS_DATA: //8014
        {
            return getStackedBenefitsData(jsonObject);
        }
        case REQ_EMULATOR_CALCULATION://8015
        {
            qDebug() << this << " >> StartStackedBenefitsCalculation";
            return StartEmulatorCalculation(jsonObject);
        }
        case REQ_EMULATOR_DATA: // 8016
        {
            return getEmulatorData(jsonObject);
        }
        default:
        {
            QJsonObject recordObject;
            recordObject.insert("response", processMessage(ERR_REQUEST_INVALID));
            qDebug() << this << " performRequest " << processMessage(ERR_REQUEST_INVALID);
            data = new QJsonDocument(recordObject);
            return data->toJson();
        }
    }

}

QString ProcessRequest::StartProductionCostCalculation(QJsonObject jsonObject) {

    std::string _username = jsonObject["username"].toString().toStdString();
    std::string _scenario = jsonObject["scenario"].toString().toStdString();
    std::string _case = jsonObject["case"].toString().toStdString();
    std::string __query("SELECT row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?;");
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    try {
        
        prep_stmt = con->prepareStatement(__query);
        prep_stmt->setString(1, _username);
        prep_stmt->setString(2, _scenario);
        prep_stmt->setString(3, _case);
        int64_t row_id;
        sql::ResultSet *res = prep_stmt->executeQuery();

        if (res->next())
            row_id = res->getInt("row_id");
        delete prep_stmt;
        delete res;
        std::string query1("UPDATE scenarios_and_cases SET production_cost_calculation_status = 'IN_PROGRESS', production_cost_calculation_noess_status = 'IN_PROGRESS' WHERE username = ? AND scenario = ? AND cases = ?;");
        prep_stmt = con->prepareStatement(query1);
        prep_stmt->setString(1, _username);
        prep_stmt->setString(2, _scenario);
        prep_stmt->setString(3, _case);
        prep_stmt->execute();

        productionCostThread = new ProductionCostThread(glpk,identifierId,row_id, dbConnector);
        ProductionCostThreadNoEss*  productionCostThread1 = new ProductionCostThreadNoEss(glpk,identifierId,row_id, dbConnector);
        productionCostThread->start();
        productionCostThread1->start();
        jsonObject.insert("response", "IN_PROGRESS");
        qDebug() << this << " >> StartProductionCostCalculation Finished";
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> StartProductionCostCalculation >> " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    }

}

QString ProcessRequest::getProductionCostData(QJsonObject jsonObject) {
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    std::string username = jsonObject["username"].toString().toStdString();
    std::string scenario = jsonObject["scenario"].toString().toStdString();
    std::string _case = jsonObject["case"].toString().toStdString();
    std::string query = "SELECT production_cost_calculation_status ,production_cost_calculation_date,production_cost_calculation_noess_status, row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?";

    try {
        
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, username);
        prep_stmt->setString(2, scenario);
        prep_stmt->setString(3, _case);
        sql::ResultSet *res = prep_stmt->executeQuery();
        std::string status;
        std::string status1;
        int64_t row_id;
        std::string date;
        while (res->next()) {
            status = res->getString("production_cost_calculation_status");
            date = res->getString("production_cost_calculation_date");
            row_id = res->getInt("row_id");
            status1 = res->getString("production_cost_calculation_noess_status");
        }

       QString temp_status = QString::fromStdString(status);
       QString temp_status1 = QString::fromStdString(status1);
        if ((QString().compare(temp_status, "IN_PROGRESS") == 0) || (QString().compare(temp_status1, "IN_PROGRESS") == 0)) {
            jsonObject.insert("response", "IN_PROGRESS");
        } else if ((QString().compare(temp_status, "COMPLETE") == 0) && (QString().compare(temp_status1, "COMPLETE") == 0) ) {
            jsonObject.insert("response", "COMPLETE");
            jsonObject.insert("production_cost_calculation_date",QString::fromStdString(date));
            getProductionCostResults(&jsonObject, row_id);
            
        }
        else
        {
            qDebug() << temp_status;
            jsonObject.insert("response", temp_status +":"+temp_status1);
        }
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> getProductionCostData >> " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    }
}

QString ProcessRequest::getStackedBenefitsData(QJsonObject jsonObject) {
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    std::string username = jsonObject["username"].toString().toStdString();
    std::string scenario = jsonObject["scenario"].toString().toStdString();
    std::string _case = jsonObject["case"].toString().toStdString();
    std::string query = "SELECT stacked_benefits_calculation_status ,stacked_benefits_calculation_date, row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?";

    try {
        
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, username);
        prep_stmt->setString(2, scenario);
        prep_stmt->setString(3, _case);
        sql::ResultSet *res = prep_stmt->executeQuery();
        std::string status;
        int64_t row_id;
        std::string date;
        while (res->next()) {
            status = res->getString("stacked_benefits_calculation_status");
            date = res->getString("stacked_benefits_calculation_date");
            row_id = res->getInt("row_id");
        }

        QString temp_status = QString::fromStdString(status);
        if (QString().compare(temp_status, "IN_PROGRESS") == 0) {
            jsonObject.insert("response", "IN_PROGRESS");
        } else if (QString().compare(temp_status, "COMPLETE") == 0) {
            jsonObject.insert("response", "COMPLETE");
            jsonObject.insert("stacked_benefits_calculation_date", QString::fromStdString(date));
            getStackedBenefitsResults(&jsonObject, row_id);
        }
        else
        {
            qDebug() << temp_status;
            jsonObject.insert("response", temp_status);
        }
        data = new QJsonDocument(jsonObject);
        
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> getStackedBenefitsData >> " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(jsonObject);
        
        return data->toJson();
    }
}
QString ProcessRequest::getStackedBenefitsResults(QJsonObject *jsonObject, int row_id) {
    sql::ResultSet *res;
    sql::ResultSetMetaData *res_meta;
    try {
        int col_count;
        
        prep_stmt = con->prepareStatement("SELECT * FROM benefit_buckets_output_es_buckets_table WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING benefit_buckets_output_es_buckets_table";
        QJsonArray array8;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array8.push_back(responseObj);
            }
        }
        jsonObject->insert("benefit_buckets_output_es_buckets_table", array8);
        delete res;
        delete prep_stmt;
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject->insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> getAlternativeAnalysisResults >> " << processMessage(ERR_REQUEST_QUERY);

    }
    return "";
}
QString ProcessRequest::StartStackedBenefitsCalculation(QJsonObject jsonObject) {

    std::string _username = jsonObject["username"].toString().toStdString();
    std::string _scenario = jsonObject["scenario"].toString().toStdString();
    std::string _case = jsonObject["case"].toString().toStdString();
    std::string __query("SELECT row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?;");
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    try {
        
        prep_stmt = con->prepareStatement(__query);
        prep_stmt->setString(1, _username);
        prep_stmt->setString(2, _scenario);
        prep_stmt->setString(3, _case);
        int64_t row_id;
        sql::ResultSet *res = prep_stmt->executeQuery();

        if (res->next())
            row_id = res->getInt("row_id");
        delete prep_stmt;
        delete res;
        std::string query1("UPDATE scenarios_and_cases SET stacked_benefits_calculation_status = 'IN_PROGRESS' WHERE username = ? AND scenario = ? AND cases = ?;");
        prep_stmt = con->prepareStatement(query1);
        prep_stmt->setString(1, _username);
        prep_stmt->setString(2, _scenario);
        prep_stmt->setString(3, _case);
        prep_stmt->execute();

        storageBenefitsThread = new StorageBenefitsThread(glpk,identifierId,row_id, dbConnector);
        storageBenefitsThread->start();
        jsonObject.insert("response", "IN_PROGRESS");
        qDebug() << this << " >> StartStackedBenefitsCalculation Finished";
        data = new QJsonDocument(jsonObject);
        
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> StartStackedBenefitsCalculation >> " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    }

}
QString ProcessRequest::getEmulatorResults(QJsonObject *jsonObject,int row_id)
{
       
    sql::ResultSet *res;
    sql::ResultSetMetaData *res_meta;
    try {
        int col_count;
        prep_stmt = con->prepareStatement("SELECT * FROM emulator_output_files WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING emulator_output_files";
        QJsonObject responseObj;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                
            }
        }
        jsonObject->insert("emulator_output_files", responseObj);
        delete res;
        delete prep_stmt;
        
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject->insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> StartEmulatorCalculation  >> " << processMessage(ERR_REQUEST_QUERY);

    }
    
    return "";
}
QString ProcessRequest::getEmulatorData(QJsonObject jsonObject) {
    
    std::string username = jsonObject["username"].toString().toStdString();
    std::string scenario = jsonObject["scenario"].toString().toStdString();
    std::string _case = jsonObject["case"].toString().toStdString();
    std::string query = "SELECT emulator_calculation_status , emulator_calculation_date, row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?";
    while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    try {
        
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, username);
        prep_stmt->setString(2, scenario);
        prep_stmt->setString(3, _case);
        sql::ResultSet *res = prep_stmt->executeQuery();
        std::string status;
        int64_t row_id;
        std::string date;
        while (res->next()) {
            status = res->getString("emulator_calculation_status");
            row_id = res->getInt("row_id");
            date =  res->getString("emulator_calculation_date");
        }

        QString temp_status = QString::fromStdString(status);
        if (QString().compare(temp_status, "IN_PROGRESS") == 0) {
            jsonObject.insert("response", "IN_PROGRESS");
        } else if (QString().compare(temp_status, "COMPLETE") == 0) {
            jsonObject.insert("response", "COMPLETE");
            jsonObject.insert("emulator_calculation_date", QString::fromStdString(date));
            getEmulatorResults(&jsonObject, row_id);
        }
        else
        {
            qDebug() << temp_status;
            jsonObject.insert("response", temp_status);
        }
        data = new QJsonDocument(jsonObject);
        
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> getStackedBenefitsData >> " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(jsonObject);
        
        return data->toJson();
    }
}

QString ProcessRequest::StartEmulatorCalculation(QJsonObject jsonObject) {

    std::string _username = jsonObject["username"].toString().toStdString();
    std::string _scenario = jsonObject["scenario"].toString().toStdString();
    std::string _case = jsonObject["case"].toString().toStdString();
    std::string __query("SELECT row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?;");
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    try {
        
        prep_stmt = con->prepareStatement(__query);
        prep_stmt->setString(1, _username);
        prep_stmt->setString(2, _scenario);
        prep_stmt->setString(3, _case);
        int64_t row_id;
        sql::ResultSet *res = prep_stmt->executeQuery();

        if (res->next())
            row_id = res->getInt("row_id");
        delete prep_stmt;
        delete res;
        std::string query1("UPDATE scenarios_and_cases SET emulator_calculation_status = 'IN_PROGRESS' WHERE username = ? AND scenario = ? AND cases = ?;");
        prep_stmt = con->prepareStatement(query1);
        prep_stmt->setString(1, _username);
        prep_stmt->setString(2, _scenario);
        prep_stmt->setString(3, _case);
        prep_stmt->execute();
        emulator = new EmulatorThread(glpk,identifierId,row_id, dbConnector);
        emulator->start();
        //test1 = new ProductionCostThread_1(glpk,identifierId,row_id, dbConnector);
        //test1->start();
        jsonObject.insert("response", "IN_PROGRESS");
        qDebug() << this << " >> StartEmulatorCalculation Finished";
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> StartEmulatorCalculation Finished >> " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    }

}
QString ProcessRequest::getProductionCostResults(QJsonObject *jsonObject, int row_id) {
    sql::ResultSet *res;
    sql::ResultSetMetaData *res_meta;
    try {
        int col_count;
        
        prep_stmt = con->prepareStatement("SELECT * FROM fuel_usage_output_installed_cap_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING fuel_usage_output_installed_cap_tables";
        QJsonArray array5;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array5.push_back(responseObj);
            }
        }
        jsonObject->insert("fuel_usage_output_installed_cap_tables", array5);
        delete res;
        delete prep_stmt;
        
        prep_stmt = con->prepareStatement("SELECT * FROM fuel_usage_output_installed_noess_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING fuel_usage_output_installed_noess_tables";
        QJsonArray array4;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array4.push_back(responseObj);
            }
        }
        jsonObject->insert("fuel_usage_output_installed_noess_tables", array4);
        delete res;
        delete prep_stmt;
        
        
        //select data from pc metrics noess
        prep_stmt = con->prepareStatement("SELECT * FROM generator_calculated_metrics WHERE scenario_and_cases_row_id = ? AND ess_or_noess= ? ");
        prep_stmt->setInt(1, row_id);
        prep_stmt->setBoolean(2,0);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING generator_calculated_metrics for noess";
        QJsonArray array3;
        while (res->next()) {
            QJsonObject responseObj;
            for (int i = 1; i < col_count; i++) {
                
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else if (type== "INT") {
                    int a = res->getInt(temp);
                    value = std::to_string(a);
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                
            }
            array3.push_back(responseObj);
        }
        jsonObject->insert("pc_metrics_noess_table", array3);
        delete res;
        delete prep_stmt;
        

        
        //select data from pc metrics
        prep_stmt = con->prepareStatement("SELECT * FROM generator_calculated_metrics WHERE scenario_and_cases_row_id = ? AND ess_or_noess = ?");
        prep_stmt->setInt(1, row_id);
        prep_stmt->setBoolean(2,1);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING generator_calculated_metrics for ess";
        QJsonArray array2;
        while (res->next()) {
            QJsonObject responseObj;
            for (int i = 1; i < col_count; i++) {
                
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else if (type== "INT") {
                    int a = res->getInt(temp);
                    value = std::to_string(a);
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                
            }
            array2.push_back(responseObj);
        }
        jsonObject->insert("pc_metrics_table", array2);
        delete res;
        delete prep_stmt;

        
        prep_stmt = con->prepareStatement("SELECT * FROM production_cost_output_files WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING production_cost_output_files";
        QJsonArray array1;
        while (res->next()) {
                QJsonObject responseObj;
            for (int i = 1; i < col_count; i++) {
                
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else if (type== "INT") {
                    int a = res->getInt(temp);
                    value = std::to_string(a);
                    _value = QString::fromStdString(value);
                } else if (type== "BIT") {
                    int a = res->getBoolean(temp);
                    value = std::to_string(a);
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                
            }
                array1.push_back(responseObj);
        }
        jsonObject->insert("production_cost_output_files", array1);
        delete res;
        delete prep_stmt;
        
        
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject->insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> getProductionCostResults  >> " << processMessage(ERR_REQUEST_QUERY);

    }    
    return "";
}
QString ProcessRequest::getAlternativeAnalysisResults(QJsonObject *jsonObject, int row_id) {
    sql::ResultSet *res;
    sql::ResultSetMetaData *res_meta;
    try {
        int col_count;

        
        prep_stmt = con->prepareStatement("SELECT * FROM tabular_inputs_for_existing_table_dynamic WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING tabular_inputs_for_existing_table_dynamic";
        QJsonArray array11;
        while (res->next()) {
                QJsonObject responseObj;
            for (int i = 1; i < col_count; i++) {
                
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else if (type== "INT") {
                    int a = res->getInt(temp);
                    value = std::to_string(a);
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                
            }
                array11.push_back(responseObj);
        }
        jsonObject->insert("tabular_inputs_for_existing_table_dynamic", array11);
        delete res;
        delete prep_stmt;
        
        prep_stmt = con->prepareStatement("SELECT * FROM tabular_inputs_for_existing_table_static WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING tabular_inputs_for_existing_table_static";
        QJsonArray array10;
        while (res->next()) {
                QJsonObject responseObj;
            for (int i = 1; i < col_count; i++) {
                
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else if (type== "INT") {
                    int a = res->getInt(temp);
                    value = std::to_string(a);
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                
            }
                array10.push_back(responseObj);
        }
        jsonObject->insert("tabular_inputs_for_existing_table_static", array10);
        delete res;
        delete prep_stmt;
        
        prep_stmt = con->prepareStatement("SELECT * FROM installed_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING installed_capacity_output_es_cap_tables";
        QJsonArray array9;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array9.push_back(responseObj);
            }
        }
        jsonObject->insert("installed_capacity_output_es_cap_tables", array9);
        delete res;
        delete prep_stmt;
        
        
        // KAI
        prep_stmt = con->prepareStatement("SELECT * FROM installed_capacity_output_noess_cap_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING installed_capacity_output_noess_cap_tables";
        QJsonArray array9_noess;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array9_noess.push_back(responseObj);
            }
        }
        jsonObject->insert("installed_capacity_output_noess_cap_tables", array9_noess);
        delete res;
        delete prep_stmt;
        
        
        prep_stmt = con->prepareStatement("SELECT * FROM demand_side_output_installed_cap_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING demand_side_output_installed_cap_tables";
        QJsonArray array8;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array8.push_back(responseObj);
            }
        }
        jsonObject->insert("demand_side_output_installed_cap_tables", array8);
        delete res;
        delete prep_stmt;
        
        //KAI
        prep_stmt = con->prepareStatement("SELECT * FROM demand_side_output_installed_cap_noess_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING demand_side_output_installed_cap_noess_tables";
        QJsonArray array8_noess;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array8_noess.push_back(responseObj);
            }
        }
        jsonObject->insert("demand_side_output_installed_cap_noess_tables", array8_noess);
        delete res;
        delete prep_stmt;
        
        
        
        prep_stmt = con->prepareStatement("SELECT * FROM energy_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING energy_capacity_output_es_cap_tables";
        QJsonArray array7;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array7.push_back(responseObj);
            }
        }
        jsonObject->insert("energy_capacity_output_es_cap_tables", array7);
        delete res;
        delete prep_stmt;
        
        
        //KAI
        prep_stmt = con->prepareStatement("SELECT * FROM energy_capacity_output_noess_cap_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING energy_capacity_output_noess_cap_tables";
        QJsonArray array7_noess;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array7_noess.push_back(responseObj);
            }
        }
        jsonObject->insert("energy_capacity_output_noess_cap_tables", array7_noess);
        delete res;
        delete prep_stmt;
        
        
        
        prep_stmt = con->prepareStatement("SELECT * FROM hydro_generation_output_installed_cap_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING hydro_generation_output_installed_cap_tables";
        QJsonArray array6;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array6.push_back(responseObj);
            }
        }
        jsonObject->insert("hydro_generation_output_installed_cap_tables", array6);
        delete res;
        delete prep_stmt;
        
        
        //KAI
        prep_stmt = con->prepareStatement("SELECT * FROM hydro_generation_output_installed_cap_noess_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING hydro_generation_output_installed_cap_noess_tables";
        QJsonArray array6_noess;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array6_noess.push_back(responseObj);
            }
        }
        jsonObject->insert("hydro_generation_output_installed_cap_noess_tables", array6_noess);
        delete res;
        delete prep_stmt;
        
        
        
        
        prep_stmt = con->prepareStatement("SELECT * FROM renewables_output_installed_cap_table WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING renewables_output_installed_cap_table";
        QJsonArray array5;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array5.push_back(responseObj);
            }
        }
        jsonObject->insert("renewables_output_installed_cap_table", array5);
        delete res;
        delete prep_stmt;
        
        
        //KAI
        
        prep_stmt = con->prepareStatement("SELECT * FROM renewables_output_installed_cap_noess_table WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING renewables_output_installed_cap_noess_table";
        QJsonArray array5_noess;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array5_noess.push_back(responseObj);
            }
        }
        jsonObject->insert("renewables_output_installed_cap_noess_table", array5_noess);
        delete res;
        delete prep_stmt;
        
        
        prep_stmt = con->prepareStatement("SELECT * FROM thermal_generation_output_installed_cap_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING thermal_generation_output_installed_cap_tables";
        QJsonArray array4;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array4.push_back(responseObj);
            }
        }
        jsonObject->insert("thermal_generation_output_installed_cap_tables", array4);
        delete res;
        delete prep_stmt;
        
        //KAI
        prep_stmt = con->prepareStatement("SELECT * FROM thermal_generation_output_installed_cap_noess_tables WHERE scenario_and_cases_row_id = ?");
        prep_stmt->setInt(1, row_id);
        res = prep_stmt->executeQuery();
        res_meta = res->getMetaData();
        col_count = res_meta->getColumnCount();
        qDebug() << this << " >> GETTING thermal_generation_output_installed_cap_noess_tables";
        QJsonArray array4_noess;
        while (res->next()) {

            for (int i = 1; i < col_count; i++) {
                QJsonObject responseObj;
                QString _value;
                std::string temp = res_meta->getColumnLabel(i + 1);
                sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                std::string type = a.asStdString();
                std::string value;
                if (type == "VARCHAR") {
                    value = res->getString(temp);
                    _value = QString::fromStdString(value);
                } else if (type == "DOUBLE") {
                    double a = res->getDouble(temp);
                    value = std::to_string(float(a));
                    _value = QString::fromStdString(value);
                } else
                    continue;

                responseObj.insert(QString::fromStdString(temp), _value);
                array4_noess.push_back(responseObj);
            }
        }
        jsonObject->insert("thermal_generation_output_installed_cap_noess_tables", array4_noess);
        delete res;
        delete prep_stmt;

    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject->insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> getAlternativeAnalysisResults >> " << processMessage(ERR_REQUEST_QUERY);

    }
    return "";
}

QString ProcessRequest::getAlternativeAnalysisData(QJsonObject jsonObject) {
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    std::string username = jsonObject["username"].toString().toStdString();
    std::string scenario = jsonObject["scenario"].toString().toStdString();
    std::string _case = jsonObject["case"].toString().toStdString();
    std::string query = "SELECT alternative_analysis_calculation_status ,alternative_analysis_calculation_date,alternative_analysis_calculation_noess_status, row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?";

    try {
        
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, username);
        prep_stmt->setString(2, scenario);
        prep_stmt->setString(3, _case);
        sql::ResultSet *res = prep_stmt->executeQuery();
        std::string status;
        int64_t row_id;
        std::string date;
        std::string status1;
        while (res->next()) {
            status = res->getString("alternative_analysis_calculation_status");
            date =   res->getString("alternative_analysis_calculation_date");
            status1 = res->getString("alternative_analysis_calculation_noess_status");
            row_id = res->getInt("row_id");
        }

        QString temp_status = QString::fromStdString(status);
        QString temp_status1 = QString::fromStdString(status1);
        if ( (QString().compare(temp_status, "IN_PROGRESS") == 0) || (QString().compare(temp_status1, "IN_PROGRESS") == 0)) {
            jsonObject.insert("response", "IN_PROGRESS");
        } else if ((QString().compare(temp_status, "COMPLETE") == 0) && (QString().compare(temp_status1, "COMPLETE") == 0)) {
            jsonObject.insert("response", "COMPLETE");
            jsonObject.insert("alternative_analysis_calculation_date", QString::fromStdString(date));
            getAlternativeAnalysisResults(&jsonObject, row_id);
            
        }
        else
        {
            qDebug() << temp_status;
            jsonObject.insert("response", temp_status +":" + temp_status1);
        }
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> getAlternativeAnalysisData >> " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    }
}

QString ProcessRequest::StartAlternativeAnalysisCalculation(QJsonObject jsonObject) {

    std::string _username = jsonObject["username"].toString().toStdString();
    std::string _scenario = jsonObject["scenario"].toString().toStdString();
    std::string _case = jsonObject["case"].toString().toStdString();
    std::string __query("SELECT row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?;");
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    try {
        
        prep_stmt = con->prepareStatement(__query);
        prep_stmt->setString(1, _username);
        prep_stmt->setString(2, _scenario);
        prep_stmt->setString(3, _case);
        int64_t row_id;
        sql::ResultSet *res = prep_stmt->executeQuery();

        if (res->next())
            row_id = res->getInt("row_id");
        delete prep_stmt;
        delete res;
        std::string query1("UPDATE scenarios_and_cases SET alternative_analysis_calculation_status = 'IN_PROGRESS',alternative_analysis_calculation_noess_status = 'IN_PROGRESS' WHERE username = ? AND scenario = ? AND cases = ?;");
        prep_stmt = con->prepareStatement(query1);
        prep_stmt->setString(1, _username);
        prep_stmt->setString(2, _scenario);
        prep_stmt->setString(3, _case);
        prep_stmt->execute();
        
        AlternativeAnalysisMultiYearNoESS *alternativeAnanlysisMultiYear1 = new AlternativeAnalysisMultiYearNoESS(glpk,identifierId,row_id, dbConnector);
        alternativeAnanlysisMultiYear = new AlternativeAnalysisMultiYearThread(glpk,identifierId,row_id, dbConnector);
        alternativeAnanlysisMultiYear->start();
        alternativeAnanlysisMultiYear1->start();
        //alternativeAnalysis = new AlternativeAnalysisThread(glpk,identifierId,row_id, dbConnector);
        //alternativeAnalysis->start();
        jsonObject.insert("response", "IN_PROGRESS");
        qDebug() << this << " >> AlternativeAnalysisCalculation Finished";
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        jsonObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> StartAlternativeAnalysisCalculation >> " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(jsonObject);
        return data->toJson();
    }

}

QString ProcessRequest::ForceSave(QJsonObject jsonObject) {
    qDebug() << this << " >> FORCE SAVING DATA";
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    QString scenario = jsonObject["scenario"].toString();

    QString _case = jsonObject["case"].toString();
    token = jsonObject["token"].toString();
    int response = setInputs(jsonObject);
    QJsonObject json;
    qDebug() << "response " << response;
    if (response == ERROR) {
        qDebug() << "ERROR";
        json.insert("response", processMessage(ERR_REQUEST_QUERY));
        json.insert("scenario", scenario);
        json.insert("case", _case);
        qDebug() << this << "ForceSave " << processMessage(ERR_REQUEST_QUERY);
    } else {
        json.insert("response", processMessage(SUCCESS_REQUEST));
        json.insert("scenario", scenario);
        json.insert("case", _case);
    }
    sessions->DeleteSessionByToken(token);
    data = new QJsonDocument(json);
    return data->toJson();
}

QString ProcessRequest::SaveData(QJsonObject jsonObject) {

    qDebug() << this << " >> SAVING DATA";
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    QString _username = jsonObject["username"].toString();
    QString scenario = jsonObject["scenario"].toString();
    QString _case = jsonObject["case"].toString();
    int response = setInputs(jsonObject);
    
    QJsonObject json;
    qDebug() << "Response " << response;
    if (response == ERROR) {
        qDebug() << "ERROR";
        json.insert("response", processMessage(ERR_REQUEST_QUERY));
        json.insert("scenario", scenario);
        json.insert("case", _case);
        qDebug() << this << " ForceSave " << processMessage(ERR_REQUEST_QUERY);
    } else {
         std::string _query("SELECT modification_date FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?;");
         prep_stmt = con->prepareStatement(_query);
         prep_stmt->setString(1, _username.toStdString());
         prep_stmt->setString(2, scenario.toStdString());
         prep_stmt->setString(3, _case.toStdString());
         sql::ResultSet *res = prep_stmt->executeQuery();
         std::string  modification_date;
         if(res->next())
            modification_date = res->getString("modification_date");
        delete prep_stmt;
        json.insert("response", processMessage(SUCCESS_REQUEST));
        json.insert("scenario", scenario);
        json.insert("case", _case);
        json.insert("modification_date",QString::fromStdString(modification_date));
    }
    data = new QJsonDocument(json);
    return data->toJson();
}

int ProcessRequest::DeleteProject(int64_t row_id) {
    try {

        std::string query = "DELETE FROM demand_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM energy_storage_dynamic_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM generation_conventional_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM generation_conventional_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM generation_hydro_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM generation_renewables_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM hydro_monthly_energy_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM programs_demand_side_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM programs_planning_criteria_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM programs_renewables_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM fuel_price_forecast_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM tech_capital_dynamic_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM energy_storage_cost_dynamic_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM installed_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM installed_capacity_output_noess_cap_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM demand_side_output_installed_cap_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM demand_side_output_installed_cap_noess_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM energy_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM energy_capacity_output_noess_cap_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM hydro_generation_output_installed_cap_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt; 
        query = "DELETE FROM hydro_generation_output_installed_cap_noess_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM renewables_output_installed_cap_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt; 
        query = "DELETE FROM renewables_output_installed_cap_noess_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM thermal_generation_output_installed_cap_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM thermal_generation_output_installed_cap_noess_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM fuel_usage_output_installed_cap_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM fuel_usage_output_installed_noess_tables WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM benefit_buckets_output_es_buckets_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM production_cost_output_files WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM calculation_settings_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM emulator_output_files WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM generator_calculated_metrics WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;
        query = "DELETE FROM calculation_results_table WHERE scenario_and_cases_row_id ='" + std::to_string(row_id) + "'";   
        prep_stmt = con->prepareStatement(query);
        prep_stmt->execute();
        delete prep_stmt;

    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;

    }
    return SUCCESS;
}

int ProcessRequest::setInputs(QJsonObject jsonObject) {

    std::string username = jsonObject["username"].toString().toStdString();
    std::string scenario = jsonObject["scenario"].toString().toStdString();
    std::string _case = jsonObject["case"].toString().toStdString();
    std::string scenario_notes = jsonObject["scenario_notes"].toString().toStdString();
    std::string case_notes = jsonObject["case_notes"].toString().toStdString();
    std::string country = jsonObject["country"].toString().toStdString();
    qDebug() << QString::fromStdString(username) << ":" << QString::fromStdString(scenario)
            << ":" << QString::fromStdString(_case) << ":" << QString::fromStdString(scenario_notes)
            << ":" << QString::fromStdString(case_notes) << ":" << QString::fromStdString(country);
    std::string modification_date;
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    
    try {

        qDebug() << this << " >> STARTING QUERY";
        
        std::string query("SELECT row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?;");
        prep_stmt = con->prepareStatement(query);
        prep_stmt->setString(1, username);
        prep_stmt->setString(2, scenario);
        prep_stmt->setString(3, _case);

        sql::ResultSet *res = prep_stmt->executeQuery();
        delete prep_stmt;
        bool exists = res->next();
        int64_t row_id;
        QString build_query = "";
        QStringList build_fields;
        QStringList data;
        std::string _query;
        
        if (exists) {
            row_id = res->getInt("row_id");
            _query = std::string("UPDATE scenarios_and_cases SET username = ?,scenario = ?,cases = ?,scenario_notes = ?,case_notes = ?,country = ?"
                    ",modification_date=NOW(),alternative_analysis_calculation_status='NOT_STARTED',production_cost_calculation_status='NOT_STARTED',"
                    "stacked_benefits_calculation_status='NOT_STARTED',emulator_calculation_status='NOT_STARTED',alternative_analysis_calculation_noess_status='NOT_STARTED',production_cost_calculation_noess_status='NOT_STARTED'"
                    " where row_id = '" + std::to_string(row_id) + "'");
            prep_stmt = con->prepareStatement(_query);
            prep_stmt->setString(1, username);
            prep_stmt->setString(2, scenario);
            prep_stmt->setString(3, _case);
            prep_stmt->setString(4, scenario_notes);
            prep_stmt->setString(5, case_notes);
            prep_stmt->setString(6, country);
            prep_stmt->execute();
            prep_stmt->~PreparedStatement();
            DeleteProject(row_id);           
        } else {
            _query = std::string("INSERT INTO scenarios_and_cases(username,scenario,cases,scenario_notes,case_notes,country)"
                    "VALUES(?,?,?,?,?,?)");            
        
            prep_stmt = con->prepareStatement(_query);
            prep_stmt->setString(1, username);
            prep_stmt->setString(2, scenario);
            prep_stmt->setString(3, _case);
            prep_stmt->setString(4, scenario_notes);
            prep_stmt->setString(5, case_notes);
            prep_stmt->setString(6, country);
            prep_stmt->execute();
            prep_stmt->~PreparedStatement();
            std::string __query("SELECT row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?;");
            prep_stmt = con->prepareStatement(__query);
            prep_stmt->setString(1, username);
            prep_stmt->setString(2, scenario);
            prep_stmt->setString(3, _case);
            res = prep_stmt->executeQuery();
            if (res->next())
                row_id = res->getInt("row_id");
        }
        qDebug() << "Finished inserting into scenarios and cases table";
        QStringList a = jsonObject.keys();
        std::vector<QStringList> temp_array;
        int table_count = 0;
        QString table_type;
        for (int i = 0; i < a.size(); i++) {
            QStringList b = a[i].split("]");

            if (b.count() == 1)
                continue;

            QStringList c = b[b.size() - 2].split("[");
            QString fields = c[c.count() - 1];


            QStringList row;
            QStringList _table;
            QStringList raw_data;
            if (b.count() == 5) {
                row = b[b.size() - 3].split("[");
                _table = b[b.size() - (b.size() - 1)].split("[");
                raw_data.push_back(row[row.size() - 1]);
                raw_data.push_back(fields);
                raw_data.push_back(jsonObject[a[i]].toString());
                temp_array.push_back(raw_data);

            }
            if (QString().compare(fields, "table") == 0) {

                QStringList data;
                QStringList build_fields;
                table_count++;
                qDebug() << jsonObject[a[i]].toString() << ":" << table_count;
                qDebug() << this << " QUERING " << jsonObject[a[i]].toString();
                if (QString().compare(jsonObject[a[i + 1]].toString(), "static") == 0) {
                    qDebug() << "table is static";
                    for (unsigned int y = 0; y < temp_array.size(); y++) {
                        if (QString::compare(temp_array[y][1], "undefined") == 0)
                            continue;

                        data.push_front(temp_array[y][2]);
                        build_fields.push_front(temp_array[y][1]);
                        build_query = "INSERT INTO " + jsonObject[a[i]].toString() + "( ";
                        for (int z = 0; z < build_fields.size(); z++) {
                            build_query.append(build_fields[z]).append(",");
                        }
                        build_query.append("scenario_and_cases_row_id").append(")");
                        build_query.append(" VALUES(");
                        for (int z = 0; z <= build_fields.size(); z++) {
                            if (z == build_fields.size()) {
                                build_query.append(" ? )");
                                continue;
                            }
                            build_query.append("? ,");
                        }
                    }//end else
                    qDebug() << "INSERT";
                    prep_stmt = con->prepareStatement(std::string(build_query.toStdString()));
                    for (int x = 0; x < data.size(); x++) {
                        qDebug() << data[x];
                        if (data[x].at(0).isNumber())
                            prep_stmt->setDouble(x + 1, data[x].toDouble());
                        else
                            prep_stmt->setString(x + 1, data[x].toStdString());
                    }
                    prep_stmt->setInt64(data.size() + 1, row_id);
                    prep_stmt->execute();
                    qDebug() << this << " QUERY PERFORMED";
                    prep_stmt->~PreparedStatement();
                    build_query = "";
                    build_fields.clear();
                    data.clear();
                    temp_array.clear();
                }// end table count
                else {
                    qDebug() << "table is dynamic";
                    std::vector < QStringList > rows;
                    std::vector <QStringList > rows_data;
                    int row = 0;
                    for (unsigned int q = 0; q < temp_array.size(); q++) {
                        if (row == temp_array[q][0].toInt()) {
                            if (QString::compare(temp_array[q][1], "undefined") == 0) {
                                if (q == temp_array.size() - 1) {
                                    qDebug() << " >> Inserted";
                                    rows.push_back(build_fields);
                                    rows_data.push_back(data);
                                }

                                continue;
                            }
                            build_fields.push_back(temp_array[q][1]);
                            data.push_back(temp_array[q][2]);
                            if (q == temp_array.size() - 1) {
                                rows.push_back(build_fields);
                                rows_data.push_back(data);
                            }
                        } else {
                            rows.push_back(build_fields);
                            rows_data.push_back(data);
                            build_fields.clear();
                            data.clear();
                            if (QString::compare(temp_array[q][1], "undefined") == 0) {
                                if (q == temp_array.size() - 1) {
                                    qDebug() << " >> Inserted";
                                    rows.push_back(build_fields);
                                    rows_data.push_back(data);
                                }
                                continue;
                            }
                            build_fields.push_back(temp_array[q][1]);
                            data.push_back(temp_array[q][2]);
                            row++;
                        }
                    }
                    qDebug() << "QUERY";
                    for (unsigned int d = 0; d < rows.size(); d++) {
                        qDebug() << "INSERT";
                        build_query = "INSERT INTO " + jsonObject[a[i]].toString() + "( ";
                        qDebug() << build_fields.size();
                        for (int z = 0; z < rows[d].size(); z++) {
                            build_query.append(rows[d][z]).append(",");
                        }
                        build_query.append("scenario_and_cases_row_id").append(")");
                        build_query.append(" VALUES(");
                        for (int z = 0; z <= rows[d].size(); z++) {
                            if (z == rows[d].size()) {
                                build_query.append(" ? )");
                                continue;
                            }
                            build_query.append("? ,");
                        }
                        qDebug() << build_query;

                        prep_stmt = con->prepareStatement(std::string(build_query.toStdString()));
                        for (int x = 0; x < rows_data[d].size(); x++) {
                            qDebug() << rows_data[d][x];
                            if (rows_data[d][x].at(0).isNumber())
                                prep_stmt->setDouble(x + 1, rows_data[d][x].toDouble());
                            else
                                prep_stmt->setString(x + 1, rows_data[d][x].toStdString());
                        }
                        prep_stmt->setInt64(rows_data[d].size() + 1, row_id);
                        prep_stmt->execute();
                        qDebug() << this << " QUERY PERFORMED ";
                        prep_stmt->~PreparedStatement();
                        build_query = "";

                    }//end for

                    temp_array.clear();
                }// end else
            }//end table            
        }// end keys
        
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        qDebug() << "ERROR IN ALGORITHM";
        delete prep_stmt;
        delete con;
        qDebug() << this << " >> setInputs >> " << processMessage(ERR_REQUEST_INVALID);
        return ERROR;
    }
    qDebug() << "Save DATA SUCCESS";
    return SUCCESS;
};

QString ProcessRequest::getCaseData(QJsonObject jsonObject) {
    qDebug() << this << " >> get Case Data";
    std::string username = jsonObject["username"].toString().toStdString();
    std::string scenario = jsonObject["scenario"].toString().toStdString();
    std::string _case = jsonObject["case"].toString().toStdString();
    std::string query = "SELECT country, row_id FROM scenarios_and_cases WHERE username = ? AND scenario = ? AND cases = ?";
    sql::ResultSetMetaData *res_meta;
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    qDebug() << this << " >> Get Case Data processing with Query";
    QJsonObject recordObject;
    qDebug() << QString::fromStdString(username);
    qDebug() << QString::fromStdString(scenario);
    qDebug() << QString::fromStdString(_case);
    recordObject.insert("scenario", QString::fromStdString(scenario));
    recordObject.insert("case", QString::fromStdString(_case));
    try {
        
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, username);
        prep_stmt->setString(2, scenario);
        prep_stmt->setString(3, _case);
        sql::ResultSet *res = prep_stmt->executeQuery();
        int scenario_and_cases_row_id;
        int col_count;
        if (res == NULL) {
            recordObject.insert("response", processMessage(SUCCESS_NO_PROJECTS));

        } else {

            while (res->next()) {
                scenario_and_cases_row_id = res->getInt("row_id");
                std::string country = res->getString("country");
                qDebug() << "row_id  " << scenario_and_cases_row_id;
                recordObject.insert("country", QString::fromStdString(country));
            }
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM calculation_settings_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING calculation_settings_table";
            QJsonArray array14;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array14.push_back(responseObj);
                }
            }
            recordObject.insert("calculation_settings_table", array14);
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM programs_planning_criteria_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING programs_planning_criteria_table";
            QJsonArray array13;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array13.push_back(responseObj);
                }
            }
            recordObject.insert("programs_planning_criteria_table", array13);
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM energy_storage_cost_dynamic_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING energy_storage_cost_dynamic_table";
            QJsonArray array12;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array12.push_back(responseObj);
                }
            }
            recordObject.insert("energy_storage_cost_dynamic_table", array12);
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM tech_capital_dynamic_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING tech_capital_dynamic_table";
            QJsonArray array11;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array11.push_back(responseObj);
                }
            }
            recordObject.insert("tech_capital_dynamic_table", array11);

            delete res;
            delete prep_stmt;
            query = "SELECT * FROM fuel_price_forecast_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING fuel_price_forecast_table";
            QJsonArray array10;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array10.push_back(responseObj);
                }
            }
            recordObject.insert("fuel_price_forecast_table", array10);
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM demand_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING demand_table";
            QJsonArray array9;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array9.push_back(responseObj);
                }
            }
            recordObject.insert("demand_table", array9);
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM energy_storage_dynamic_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING energy_storage_dynamic_table";
            QJsonArray array8;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array8.push_back(responseObj);
                }
            }
            recordObject.insert("energy_storage_dynamic_table", array8);
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM generation_conventional_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING generation_conventional_table";
            QJsonArray array7;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array7.push_back(responseObj);
                }
            }
            recordObject.insert("generation_conventional_table", array7);
            query = "SELECT * FROM generation_hydro_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING generation_hydro_table";
            QJsonArray array6;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array6.push_back(responseObj);
                }
            }
            recordObject.insert("generation_hydro_table", array6);
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM generation_renewables_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING generation_renewables_table";
            QJsonArray array5;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;
                    qDebug() << "value:" << _value;
                    responseObj.insert(QString::fromStdString(temp), _value);
                    array5.push_back(responseObj);
                }
            }
            recordObject.insert("generation_renewables_table", array5);

            query = "SELECT * FROM hydro_monthly_energy_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING hydro_monthly_energy_table";
            QJsonArray array4;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array4.push_back(responseObj);
                }
            }
            recordObject.insert("hydro_monthly_energy_table", array4);
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM programs_demand_side_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING programs_demand_side_table";
            QJsonArray array3;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array3.push_back(responseObj);
                }
            }
            recordObject.insert("programs_demand_side_table", array3);
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM programs_planning_criteria_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING programs_planning_criteria_table";
            QJsonArray array2;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array2.push_back(responseObj);
                }
            }
            recordObject.insert("programs_planning_criteria_table", array2);
            delete res;
            delete prep_stmt;
            query = "SELECT * FROM programs_renewables_table WHERE scenario_and_cases_row_id = '" + std::to_string(scenario_and_cases_row_id) + "'";
            prep_stmt = con->prepareStatement(query.c_str());
            res = prep_stmt->executeQuery();
            res_meta = res->getMetaData();
            col_count = res_meta->getColumnCount();
            qDebug() << this << " >> GETTING programs_renewables_table";
            QJsonArray array1;
            while (res->next()) {

                for (int i = 1; i < col_count; i++) {
                    QJsonObject responseObj;
                    QString _value;
                    std::string temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    std::string value;
                    if (type == "VARCHAR") {
                        value = res->getString(temp);
                        _value = QString::fromStdString(value);
                    } else if (type == "DOUBLE") {
                        double a = res->getDouble(temp);
                        value = std::to_string(float(a));
                        _value = QString::fromStdString(value);
                    } else
                        continue;

                    responseObj.insert(QString::fromStdString(temp), _value);
                    array1.push_back(responseObj);
                }
            }
            recordObject.insert("programs_renewables_table", array1);
            delete res;
            delete prep_stmt;
            getAlternativeAnalysisResults(&recordObject,scenario_and_cases_row_id);
            getProductionCostResults(&recordObject, scenario_and_cases_row_id);
            getStackedBenefitsResults(&recordObject, scenario_and_cases_row_id);
            getEmulatorResults(&recordObject, scenario_and_cases_row_id);
            if (recordObject.isEmpty()) {
                recordObject.insert("response", processMessage(ERR_INVALID_REQU));
                recordObject.insert("reqIp", reqIp);
            } else {
                recordObject.insert("response", processMessage(SUCCESS_REQUEST));
                recordObject.insert("reqIp", reqIp);

            }

        }

        data = new QJsonDocument(recordObject);
        
        return data->toJson();
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete prep_stmt;
        delete con;
        recordObject.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> getCaseData >> " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(recordObject);
        return data->toJson();
    }
}

QString ProcessRequest::credentialValidation(QJsonObject jsonObject) {

    qDebug() << ">> credentialValidation";
    std::string username = jsonObject["username"].toString().toStdString();
    std::string password = jsonObject["password"].toString().toStdString();
    reqIp = jsonObject["reqIp"].toString();
    qDebug() << QString::fromStdString(username);
    qDebug() << QString::fromStdString(password);
     while(con == NULL)
        {
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("credentials",con);
          count++;
        }
    std::string query = "SELECT * from Credentials where username = ? AND password = ? ";
    
    prep_stmt = con->prepareStatement(query.c_str());
    prep_stmt->setString(1, username);
    prep_stmt->setString(2, password);
    qDebug() << this << " >> Get Credentials processing with Query";
    sql::ResultSet *res = prep_stmt->executeQuery();
    qDebug() << this << " >> Get Credentials processing with Query";
    QJsonObject recordObject;
    if (res == NULL) {
        recordObject.insert("response", processMessage(SUCCESS_NO_PROJECTS));
    } else {
        std::string _username;
        while (res->next()) {
            _username = res->getString("username");
        }
        if (QString::fromStdString(_username).isEmpty()) {
            recordObject.insert("response", processMessage(ERR_CREDENTIAL_INVALID));
        } else {
            qDebug() << "REQ_CREDENTIAL_VALIDATION";
            recordObject.insert("response", processMessage(CREDENTIAL_ACCEPTED));
            recordObject.insert("reqIp", reqIp);
            recordObject.insert("username", QString::fromStdString(username));
            recordObject.insert("token", createToken.getToken());
            sessions->StoreSession(recordObject);
        }

    }
    delete prep_stmt;
    delete res;
    query = "SELECT * from SBT_Sessions where username = ?";
    prep_stmt = con->prepareStatement(query.c_str());
    prep_stmt->setString(1, username);    
    qDebug() << this << " >> Get SBT_Sessions processing with Query";
    res = prep_stmt->executeQuery();
    if(res->next())
        recordObject.insert("active", true);
    else
    {
        query = "Insert into SBT_Sessions(username,userIp) VALUES(?,?)";
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, username);
        prep_stmt->setString(2, reqIp.toStdString());
        qDebug() << this << " >> Get SBT_Sessions processing with Query";
        prep_stmt->execute();
        recordObject.insert("active", false);
    }
    delete prep_stmt;
    delete res;
    delete con;
    
    data = new QJsonDocument(recordObject);

    return data->toJson();
}

QString ProcessRequest::getProjects_Runs(QJsonObject jsonObject) {
    qDebug() << "Get Projects Runs for >> " + jsonObject["reqIp"].toString();
    std::string username = jsonObject["username"].toString().toStdString();
    
    
    while(con == NULL)
        {
        qDebug() << " con " << con;
          if(count == 1)
          {            
              count = 0;
              ThreadSleep(1000);
          }
          con = dbConnector->getCon("irena_storage_benefits_tool",con);
          count++;
        }
    
    sql::ResultSet *res;
    sql::ResultSet *res_1;
    QJsonArray projects_arrays;
    QJsonObject recordObject;
    try {
        std::string query = "SELECT DISTINCT scenario FROM scenarios_and_cases WHERE username = ?";
        qDebug() << this << " >> Get Case Data processing with Query";
        
        prep_stmt = con->prepareStatement(query.c_str());
        prep_stmt->setString(1, username);
        qDebug() << this << " >> Get Project processing with Query";
        res = prep_stmt->executeQuery();
        qDebug() << this << " >> Get Projects Query performed";
        if (res == NULL) {
            recordObject.insert("response", processMessage(ERR_REQUEST_QUERY));
            data = new QJsonDocument(recordObject);
            
            delete prep_stmt;
            delete res;
            return data->toJson();
        }
        prep_stmt->~PreparedStatement();
        int single_run = 0;

        while (res->next()) {
            QJsonObject project_object;
            std::string scenario = res->getString("scenario");
            project_object.insert("scenario", QString::fromStdString(scenario));
            qDebug() << this << "scenario:" << QString::fromStdString(scenario);
            single_run++;
            std::string queryRuns = "SELECT * FROM scenarios_and_cases WHERE username = ? AND scenario = ? ";
            qDebug() << this << " >> Get Cases processing with Query";
            prep_stmt = con->prepareStatement(queryRuns.c_str());
            prep_stmt->setString(1, username);
            prep_stmt->setString(2, scenario);
            res_1 = prep_stmt->executeQuery();
            qDebug() << this << " >> Get Cases Query performed ";
            QJsonArray runs_array;
            while (res_1->next()) {
                QJsonObject run_obj;
                std::string cases = res_1->getString("cases");
                std::string scenarios_and_cases_row_id = res_1->getString("row_id");
                std::string date = res_1->getString("creation_date");
                std::string modification_date = res_1->getString("modification_date");
                std::string notes = res_1->getString("case_notes");
                std::string scenario_notes = res_1->getString("scenario_notes");
                std::string alternative_analysis_calculation_date = res_1->getString("alternative_analysis_calculation_date");
                std::string production_cost_calculation_date = res_1->getString("production_cost_calculation_date");
                std::string stacked_benefits_calculation_date = res_1->getString("stacked_benefits_calculation_date");
                std::string emulator_calculation_date = res_1->getString("emulator_calculation_date");
                std::string alternative_analysis_calculation_status = res_1->getString("alternative_analysis_calculation_status");
                std::string production_cost_calculation_status = res_1->getString("production_cost_calculation_status");
                std::string stacked_benefits_calculation_status = res_1->getString("stacked_benefits_calculation_status");
                std::string emulator_calculation_status = res_1->getString("emulator_calculation_status");
                run_obj.insert("case", QString::fromStdString(cases));
                run_obj.insert("date", QString::fromStdString(date));
                run_obj.insert("notes", QString::fromStdString(notes));
                run_obj.insert("modification_date", QString::fromStdString(modification_date));
                run_obj.insert("alternative_analysis_calculation_date",QString::fromStdString(alternative_analysis_calculation_date));
                run_obj.insert("production_cost_calculation_date",QString::fromStdString(production_cost_calculation_date));
                run_obj.insert("stacked_benefits_calculation_date",QString::fromStdString(stacked_benefits_calculation_date));
                run_obj.insert("emulator_calculation_date",QString::fromStdString(emulator_calculation_date));
                run_obj.insert("alternative_analysis_calculation_status",QString::fromStdString(alternative_analysis_calculation_status));
                run_obj.insert("production_cost_calculation_status",QString::fromStdString(production_cost_calculation_status));
                run_obj.insert("stacked_benefits_calculation_status",QString::fromStdString(stacked_benefits_calculation_status));
                run_obj.insert("emulator_calculation_status",QString::fromStdString(emulator_calculation_status));
                run_obj.insert("scenarios_and_cases_row_id",QString::fromStdString(scenarios_and_cases_row_id));
                project_object.insert("notes", QString::fromStdString(scenario_notes));
                runs_array.push_back(run_obj);
            }
            delete res_1;
            project_object.insert("cases", runs_array);
            projects_arrays.push_back(project_object);
        }
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        delete res;
        delete res_1;
        delete con;

        QJsonObject projects;
        projects.insert("response", processMessage(ERR_REQUEST_QUERY));
        qDebug() << this << " >> getProjects_Runs >> " << processMessage(ERR_REQUEST_QUERY);
        data = new QJsonDocument(projects);
        return data->toJson();
    }
    delete res;
    delete con;


    QJsonObject projects;
    projects.insert("response", processMessage(SUCCESS_REQUEST));
    projects.insert("scenario", projects_arrays);
    data = new QJsonDocument(projects);
    return data->toJson();


} 
void ProcessRequest::setThread(QThread *m)
{
    m_thread = m;
}

int ProcessRequest::ThreadSleep(int sleepTime) {
    qDebug() << this << " >> Sleep";
    m_thread->msleep(sleepTime);
    
    return CONTINUE;
}

