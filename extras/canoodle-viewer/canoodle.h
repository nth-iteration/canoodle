#ifndef CANOODLE_H
#define CANOODLE_H

#include <QtGui>
#include "mainwindow.h"

class Canoodle : public QApplication {

    Q_OBJECT
    public:
        Canoodle(int & argc, char **argv);
        virtual ~Canoodle();

    protected:
        bool event(QEvent *);

    private:
        void openUrl(QString url);

    public:
        MainWindow * win;
};

#endif // CANOODLE_H
