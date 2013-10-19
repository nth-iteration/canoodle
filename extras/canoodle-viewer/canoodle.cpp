#include "canoodle.h"

Canoodle::Canoodle( int & argc, char **argv )
    :QApplication(argc, argv)
{
    win = new MainWindow();
    win->show();


    for (int i=1; i<argc; ++i) {
        // for Windows and Linux, skip the first arg (it's just the name of the .exe)
        this->openUrl(QString(argv[i]));
    }
}

Canoodle::~Canoodle() {
}

void Canoodle::openUrl(QString url) {
    // URL decode
    url = QUrl::fromPercentEncoding(url.toUtf8());

    // change URL schemes
    url = url.replace(QRegExp("^.*canoodle://"), "http://");
    url = url.replace(QRegExp("^.*canoodles://"), "https://");
    url = url.replace(QRegExp("^.*knuffle://"), "file://");

    /*
    QMessageBox msgBox;
    msgBox.setText(url);
    msgBox.exec();
    */
    
    win->loadUrl(QUrl(url));
}

bool Canoodle::event(QEvent *event)
{
    // for Mac, which receives files, etc. on launch through events from the OS
    switch (event->type()) {
        case QEvent::FileOpen:
            this->openUrl(static_cast<QFileOpenEvent *>(event)->url().toString());
            return true;
        default:
            return QApplication::event(event);
    }
}
