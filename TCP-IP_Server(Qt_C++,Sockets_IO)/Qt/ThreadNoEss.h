

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
#include <QFileInfo>
#include <QDataStream>
#include "MessagesType.h"
#include "glpkLock.h"
#include <QDateTime>
#ifndef PRODUCTIONCOSTTHREADNOESS_H
#define PRODUCTIONCOSTTHREADNOESS_H

class ProductionCostThreadNoEss:public QThread {
    Q_OBJECT
public:
    ProductionCostThreadNoEss(glpkLock *glpk, int identifierId,int row_id,DbConnector * database,QObject *parent = 0);
    virtual ~ProductionCostThreadNoEss();
    int MonthForDay(int day);
    int HoursForDay(int day);
    
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
    QString identifier ;
    QDateTime performaceTime ;
    //functions
private:
    void run();
    int ProductionCost(int scenario_and_cases_row_id, int year);
    int ThreadSleep(int sleepTime);
    int resetGlpkLocking();

};
#endif