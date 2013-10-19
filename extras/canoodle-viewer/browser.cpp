#include "browser.h"

Browser::Browser(QMainWindow *parent) :
    QWebView(parent)
{
    this->hide();
    this->settings()->setAttribute(QWebSettings::PluginsEnabled, true);
    this->load((QUrl) "about:"); // load a dummy page
    connect(this, SIGNAL(urlChanged(QUrl)), this, SLOT(urlChanged2(QUrl)) );
    window = parent;
}

Browser::~Browser()
{
}

void Browser::updateZoom(float z){
    this->setZoomFactor(z);
}

QString Browser::getAPIVersion() {
    return "Canoodle Browser API 0.1";
}

void Browser::go(QString url) {
    int menuOffset = 0;
    #ifdef Q_OS_MAC
        // MAC, all good
    #else
        // stupid menu bar makes this too short
        menuOffset = window->menuBar()->height();
    #endif

    this->move(0, 0 + menuOffset);
    this->resize(window->width(), window->height());
    this->setUrl(QUrl(url));
    this->show();

}

void Browser::close() {
    if (this->history()->count() > 1){
        while(this->history()->canGoBack()) {
            this->back();
        }
        this->history()->clear();
    }
    this->hide();
}

void Browser::urlChanged2 (const QUrl &url)
{
    if (this->history()->count() > 1 && this->history()->currentItemIndex() == 0) {
        close();
    }
}
