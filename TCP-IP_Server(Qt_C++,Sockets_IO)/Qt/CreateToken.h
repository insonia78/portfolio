

#ifndef CREATETOKEN_H
#define CREATETOKEN_H
#include <QRandomGenerator>
#include <QObject>
class CreateToken :public QObject {
    Q_OBJECT
public:
    CreateToken(QObject *parent = 0);    
    virtual ~CreateToken();
    QString getToken();
private:
    QRandomGenerator *token;
    
};

#endif /* CREATETOKEN_H */

