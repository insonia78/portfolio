

#ifndef PROCESSREQUEST_H
#define PROCESSREQUEST_H
#include <QObject>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QDebug>
#include <string>
#include <QTime>
#include <cppconn/driver.h>
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>
#include "DbConnector.h"
#include <QCoreApplication>
#include <QThread>
#include "MessagesType.h"
#include <QTcpSocket>
#include "SessionsDb.h"
#include "CreateToken.h"
#include <QDateTime>
#include "SessionHandler.h"
#include <QProcess>
#include <vector>
#include "AlternativeAnalysisThread.h"
#include "ProductionCostThread.h"
#include "ProductionCostThreadNoEss.h"
#include "StorageBenefitsThread.h"
#include "glpkLock.h"
#include "AlternativeAnalysisMultiYearThread.h"
#include "ProductionCostThread_1.h"
#include "EmulatorThread.h"
#include "AlternativeAnalysisMultiYearNoESS.h"
#include "ProductionCostNoESS.h"

class ProcessRequest: public QObject
{
    Q_OBJECT
public:    
    ProcessRequest(QObject *parent = 0,glpkLock* glpk = 0,DbConnector *dbConnector = 0,SessionsDb *sessions = 0);
    virtual ~ProcessRequest();
    QString performRequest(QJsonObject jsonDocument);
    void setId(int);
    void setThread(QThread *m_thread);

   
//variables    
private:
  int count = 0;  
  QFile *file;
  DbConnector *dbConnector;
  SessionHandler *sessions ;
  glpkLock *glpk;
  CreateToken createToken;
  int FALSE = 0;
  int TRUE = 1;
  int *tryLockingSessions = &FALSE;
  int *tryLocking = &FALSE;
  int *isUnLucked = &FALSE; 
  QThread *m_thread;
  QString reqIp;
  QString username;
  QString token;
  bool isCompleated = false;
  int port;
  int64_t currentTime;
  QJsonDocument *data;
  sql::Connection *con = NULL;
  sql::PreparedStatement  *prep_stmt;
  QString test ;
  AlternativeAnalysisThread *alternativeAnalysis;
  AlternativeAnalysisMultiYearThread *alternativeAnanlysisMultiYear;
  ProductionCostThread *productionCostThread;
  ProductionCostThread_1 *test1;
  StorageBenefitsThread *storageBenefitsThread;
  EmulatorThread *emulator;
  
  QString identifier ;
  int identifierId ;
  
//functions    
private:    
    QString credentialValidation(QJsonObject jsonDocument);
    QString getProjects_Runs(QJsonObject jsonDocument);
    QString getCaseData(QJsonObject jsonDocument);
    QString removeProject(QJsonObject jsonDocument);
    QString removeRun(QJsonObject jsonDocument);
    
    int ThreadSleep(int);
    QString StringToQString( std::string a );
    QString SaveData(QJsonObject jsonDocument);
    int setInputs(QJsonObject jsonObject);
    int DeleteProject(int64_t slt_input_row_id);    
    QString ForceSave(QJsonObject jsonDocument);
    QString StartAlternativeAnalysisCalculation(QJsonObject jsonDocument);
    QString getAlternativeAnalysisData(QJsonObject jsonDocument);
    QString getAlternativeAnalysisResults(QJsonObject *jsonDocument,int row_id);
    QString StartProductionCostCalculation(QJsonObject jsonDocument);
    QString getProductionCostData(QJsonObject jsonDocument);
    QString getProductionCostResults(QJsonObject *jsonDocument,int row_id);
    QString StartStackedBenefitsCalculation(QJsonObject jsonDocument);
    QString getStackedBenefitsData(QJsonObject jsonDocument);
    QString getStackedBenefitsResults(QJsonObject *jsonDocument,int row_id);
    QString StartEmulatorCalculation(QJsonObject jsonDocument);
    QString getEmulatorData(QJsonObject jsonDocument);
    QString getEmulatorResults(QJsonObject *jsonDocument,int row_id);
};
    
#endif /* PROCESSREQUEST_H */

