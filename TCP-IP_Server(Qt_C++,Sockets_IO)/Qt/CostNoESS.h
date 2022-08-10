/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
#ifndef PRODUCTIONCOSTNOESSTHREAD_H
#define PRODUCTIONCOSTNOESSTHREAD_H

class ProductionCostNoESSThread:public QThread {
    Q_OBJECT
public:
    ProductionCostNoESSThread(int row_id,DbConnector * database,QObject *parent = 0);
    virtual ~ProductionCostNoESSThread();
    PC_outputs ProductionCostNoESS(int scenario_and_cases_row_id, int year, AA_outputs AAresults);
    
signals:
   void _tryLocking();
   void _unLocking();
   void _terminateThread();
private slots:
    void DeleteThread();     
public slots:
   void TryLockingResponse(int);
    //variables
private:
    DbConnector *database;
    int temp_row;
    int *row_id;
    int FALSE = 0;
    int TRUE = 1;  
    int *tryLocking = &FALSE; 
    //functions
private:
    void run();
    int ThreadSleep(int sleepTime);
    int HoursForDay(int day);
    int MonthForDay(int day);

};
#endif

