

#include "CreateToken.h"
#include <QRandomGenerator>
#include <QString>
#include <QDebug>
CreateToken::CreateToken(QObject *parent):QObject(parent)
{
    qDebug() <<  this->metaObject();
}



CreateToken::~CreateToken()
{
    qDebug() << this->metaObject() << " destroyed";
}
QString CreateToken::getToken()
{
    QString characters = "!@#$%&*()ABCDEFGHIJKLMNPQRSTUXYVWZabcdefghijlmnopqrstuxyvwz0123456789";
    token = new QRandomGenerator(QRandomGenerator::securelySeeded());
    QString _token ="";
    for(int i = 0 ; i < 20 ;i++)
    {
        int a = token->bounded(1 , characters.size());
        _token += characters[a];
    }
    qDebug() << _token; 
    return _token;
    
}
