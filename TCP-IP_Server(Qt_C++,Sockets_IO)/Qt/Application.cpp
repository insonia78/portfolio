

#include "Application.h"
#include <QCoreApplication>

Application::Application(int &argc, char **argv) : QCoreApplication(argc, argv) {
}

bool Application::notify(QObject* receiver, QEvent* even)
 {
    
    try {
        return QCoreApplication::notify(receiver,even);
    
    }catch (std::exception &e) {
        qFatal("Error %s sending event %s to object %s (%s)",
                e.what(),typeid (*receiver).name(), qPrintable(receiver->objectName()),
                typeid (*receiver).name());
    }catch (...) {
        qFatal("Error <unknown> sending event %s to object %s (%s)",
                qPrintable(receiver->objectName()),
                typeid (*receiver).name());
    }
        
        
        
        
        
        
        
        
        
        

    // qFatal aborts, so this isn't really necessary
    // but you might continue if you use a different logging lib
    return false;
}

Application::~Application() {
}

