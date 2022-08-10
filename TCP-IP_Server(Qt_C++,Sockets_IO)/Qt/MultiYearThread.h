

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
#ifndef ALTERNATIVEANALYSISMULTIYEARTHREAD_H
#define ALTERNATIVEANALYSISMULTIYEARTHREAD_H

class AlternativeAnalysisMultiYearThread:public QThread {
    Q_OBJECT
public:
    AlternativeAnalysisMultiYearThread(glpkLock *glpk , int identifierId,int row_id,DbConnector * database,QObject *parent = 0);
    virtual ~AlternativeAnalysisMultiYearThread();
    
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
    //functions
private:
    void run();
    int AlternativeAnalysisMultiYear(int scenario_and_cases_row_id, int NY);
    int ThreadSleep(int);
    int resetGlpkLocking();

};

#endif /* ALTERNATIVEANALYSISMULTIYEARTHREAD_H */


