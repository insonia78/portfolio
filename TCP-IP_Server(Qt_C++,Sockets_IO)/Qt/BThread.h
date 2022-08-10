
#include <QThread>
#include <QObject>
#include <QCoreApplication>
#include "DbConnector.h"
#include <cstdlib>
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <array>
#include <vector>
#include <utility>
#include <chrono>
#include <numeric>
#include <fstream>
#include <string>
#include "glpk.h"
#include "ObjectDefinition.h"
#include <math.h>
#include <QFile>
#include "AlternativeAnalysisNoESS.h"
#include "ProductionCostNoESS.h"
#include <sstream>
#include "glpkLock.h"
#include <QDateTime>
#ifndef STORAGEBENEFITSTHREAD_H
#define STORAGEBENEFITSTHREAD_H

class StorageBenefitsThread:public QThread {
   Q_OBJECT
public:
    StorageBenefitsThread(glpkLock *glpk,int identifierId,int row_id,DbConnector * database,QObject *parent = 0);
    virtual ~StorageBenefitsThread();
    
signals:   
   void _terminateThread();
private slots:
    void DeleteThread();    

private:
    DbConnector *database;
    glpkLock *glpk;
    int temp_row;
    int *row_id;
    int FALSE = 0;
    int TRUE = 1;  
    int *tryLocking = &FALSE;
    int *tryGlpkLocking = &FALSE;
    AlternativeAnalysisNoESSThread *alternativeAnalysisNoESSThread;
    ProductionCostNoESSThread *productionCostNoESSThread;
    QString identifier;
    QDateTime performaceTime ;

    //functions
private:
    void run();
    int StorageBenefits(int scenario_and_cases_row_id);
    int ThreadSleep(int sleepTime);
    


};

#endif /* STORAGEBENEFITSTHREAD_H */

