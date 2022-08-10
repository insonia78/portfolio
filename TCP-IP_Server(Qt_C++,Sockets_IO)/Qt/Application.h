
#include <QCoreApplication>
#include <QObject>
#include <QEvent>
#include <QDebug>
#include <cppconn/exception.h>
#ifndef APPLICATION_H
#define APPLICATION_H

class Application: public QCoreApplication  {
    Q_OBJECT
public:
    Application(int &argc, char **argv);
    virtual bool notify(QObject* receiver, QEvent* even);  
    virtual ~Application();
private:

};

#endif /* APPLICATION_H */

