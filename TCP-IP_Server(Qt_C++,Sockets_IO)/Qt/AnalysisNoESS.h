/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * File:   AlternativeAnalysisNoESS.h
 * Author: gonzales1609
 *
 * Created on February 23, 2018, 7:39 PM
 */

#ifndef ALTERNATIVEANALYSISNOESS_H
#define ALTERNATIVEANALYSISNOESS_H

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
//#include "Alternative_Analysis.h"
//#include "Production_Cost.h"
//#include "Stacked_Values.h"
#define CASE_DONE 5001
#define CASE_INFEASIBLE 5002
#define CASE_MISSING_DATA 5003

#include "mysql_connection.h"

#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <cppconn/prepared_statement.h>
#include "ObjectDefinition.h"


class AlternativeAnalysisNoESSThread:public QThread {
    Q_OBJECT
public:
    AlternativeAnalysisNoESSThread(int row_id,DbConnector * database,QObject *parent = 0);
    virtual ~AlternativeAnalysisNoESSThread();
    AA_outputs AlternativeAnalysisNoESS(int scenario_and_cases_row_id);
    
signals:
   void __tryLocking();
   void __unLocking();
   void __terminateThread();
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
    int ThreadSleep(int);

};

#endif /* ALTERNATIVEANALYSISNOESS_H */