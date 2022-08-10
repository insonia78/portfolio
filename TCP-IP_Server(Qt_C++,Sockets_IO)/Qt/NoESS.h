

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
#include <algorithm>
#include <chrono>
#include <numeric>
#include <fstream>
#include <string>
#include "glpk.h"
#include "ObjectDefinition.h"
#include <math.h>
#include <QFile>
#include "MessagesType.h"
#include "glpkLock.h"
#include <QDateTime>
#ifndef ALTERNATIVEANALYSISMULTIYEARNOESS_H
#define ALTERNATIVEANALYSISMULTIYEARNOESS_H

class AlternativeAnalysisMultiYearNoESS:public QThread {
    Q_OBJECT
public:
    AlternativeAnalysisMultiYearNoESS(glpkLock *glpk , int identifierId,int row_id,DbConnector * database,QObject *parent = 0);
    virtual ~AlternativeAnalysisMultiYearNoESS();
    
signals: 
   void _terminateThread();
private slots:
    void DeleteThread();     

    //variables
private:
    DbConnector *database;
    glpkLock *glpk;
    int temp_row;
    int *row_id;
    int FALSE = 0;
    int TRUE = 1;  
    int *tryLocking = &FALSE;
    int *tryGlpkLocking = &FALSE;
    QString identifier;
    QDateTime performaceTime ;
    //functions
private:
    void run();
    int AlternativeAnalysisMultiYearNoESSThread(int scenario_and_cases_row_id, int NY);
    int ThreadSleep(int sleepTime);
    int resetGlpkLocking();

};

#endif /* ALTERNATIVEANALYSISMULTIYEARTHREAD_H */


