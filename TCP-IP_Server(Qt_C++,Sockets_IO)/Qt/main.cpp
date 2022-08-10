
#include <QCoreApplication>
#include "TcpServer.h"
#include "Application.h"

int main(int argc, char *argv[])
{
    Application a(argc, argv);

    TcpServer SBT_API_SERVER;
    if(!SBT_API_SERVER.listening(QHostAddress::Any, 3333)){
        qDebug() << "QHostAddress: " << QHostAddress::Any;
        qDebug() << "Server not listening";
    }
        
    else
       qDebug() << "Server listening"; 
    
    return a.exec();
}