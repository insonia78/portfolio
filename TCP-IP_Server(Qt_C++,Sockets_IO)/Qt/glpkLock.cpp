/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * File:   glpkLock.cpp
 * Author: gonzales1609
 * 
 * Created on March 13, 2018, 12:31 AM
 */

#include "glpkLock.h"

glpkLock::glpkLock(QObject *parent):QObject(parent) {
}



glpkLock::~glpkLock() {
}
bool glpkLock::__tryLocking(bool isAvailable) 
{  
    lock.lockForRead();    
    if (canLock)
    {
        canLock = 0;
        isAvailable = true;
    }
    lock.unlock();
    return isAvailable;
}

void glpkLock::unLocking() {
    qDebug() << this << " >> GLPK unlocked";
    canLock = 1;
}
