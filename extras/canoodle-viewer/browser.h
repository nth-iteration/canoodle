#ifndef Browser_H
#define Browser_H

#include <QWebView>
#include <QWebHistory>
#include <QWebFrame>
#include <QDebug>
#include <QMainWindow>
#include <QMenuBar>

class Browser : public QWebView
{
    Q_OBJECT
public:
    explicit Browser(QMainWindow *parent = 0);
    ~Browser();
    void updateZoom(float z);

private:
    QMainWindow * window;

private slots:
    void urlChanged2(const QUrl &url);

signals:

public slots:
    void go(QString url);
    void close();
    QString getAPIVersion();

};

#endif // Browser_H
