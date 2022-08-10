/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * File:   glpkLock.h
 * Author: gonzales1609
 *
 * Created on March 13, 2018, 12:31 AM
 */
#include <QObject>
#include <QDebug>
#include <QReadWriteLock>
#ifndef GLPKLOCK_H
#define GLPKLOCK_H

class glpkLock:public QObject {
    Q_OBJECT
public:
    glpkLock(QObject *parent=0);
    virtual ~glpkLock();
    bool __tryLocking(bool);
    void  unLocking();
private:    
    int canLock = 1;
    QReadWriteLock lock;
    bool isAvailable = false;
   
};

#endif /* GLPKLOCK_H */

