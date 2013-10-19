#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QCoreApplication>
#include <QMainWindow>
#include <QWebInspector>
#include <QApplication>
#include <QtWebKit>
#include <QWebFrame>
#include <QWebInspector>
#include <QFileDialog>
#include <QInputDialog>
#include <QMessageBox>
#include <QShortcut>
#include <QGraphicsBlurEffect>
#include <QGraphicsColorizeEffect>
#include <QPrinter>
#include <QPrintDialog>

#include "browser.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT
    
public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();
    void loadUrl(QUrl url);

private:
    Browser * browser;

public Q_SLOTS: //slots to receive action of menu trigger.
    void attachBrowserObjects();
    void loadHistory();
    void setResolution();

private slots:
    void on_actionDebug_triggered();

    void on_actionOpen_triggered();

    void on_actionRemote_URL_triggered();

    void on_webView_loadFinished(bool arg1);

    void on_action960_x_540_triggered();

    void on_action1280_x_720_triggered();

    void on_action1920_x_1080_triggered();

    void on_actionReload_triggered();

    void on_webView_loadProgress(int progress);

    void on_actionBack_triggered();

    void loadStaticPage(int type);

    void on_actionScrolling_triggered();

    void initialiseHistoryMenu();

    void clearHistoryMenu();

    void initSettings();

    void updateHistoryInSettings();

    void on_actionAbout_triggered();

    void setLoadingUI();

    void resetLoadingUI();

    void initWebKitSettings();

    void on_actionQuirks_triggered();

    void on_actionPrint_triggered();

    void closeEvent(QCloseEvent *event);

    void clearCache();

    void on_webView_titleChanged(const QString &title);

    void on_actionSave_Screen_Shot_triggered();

    void on_webView_urlChanged (const QUrl &url);

private:
    Ui::MainWindow *ui;
    QWebInspector *inspector;
    bool isNewLoad;

    QSettings settings;
    QList<QAction *> history;

    enum Constants {
        CANOODLE_WELCOME = 0,
        CANOODLE_ERROR = -1
    };
};

#endif // MAINWINDOW_H
