

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
#ifndef PRODUCTIONCOSTTHREAD1_H
#define PRODUCTIONCOSTTHREAD1_H

class ProductionCostThread_1:public QThread {
    Q_OBJECT
public:
    ProductionCostThread_1(glpkLock *glpk, int identifierId,int row_id,DbConnector * database,QObject *parent = 0);
    virtual ~ProductionCostThread_1();
    int MonthForDay(int day);
    int HoursForDay(int day);
    
signals:
   void _tryLocking(QString);
   void _tryLockingGlpk(QString); 
   void _unLocking();
   void _unLockingGlpk();
   void _terminateThread();
private slots:
    void DeleteThread();     
public slots:
   void TryLockingResponse(int,QString);
   void TryLockingResponseGlpk(int,QString);
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
    //functions
private:
    void run();
    int ProductionCost(int scenario_and_cases_row_id, int year);
    int resetLocking();
    int resetGlpkLocking();

};
#endif