#-------------------------------------------------
#
# Project created by QtCreator 2013-05-01T10:38:52
#
#-------------------------------------------------

QT       += core gui
QT       += webkit
QT       += webkit webkitwidgets

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = Canoodle
TEMPLATE = app

QMAKE_INFO_PLIST = ./resources/mac/Info.plist # use this as Info.plist (this includes the custom canoodle:// protocol)

RC_FILE = ./resources/resources.rc
ICON = ./resources/icons/tv.icns

SOURCES +=  main.cpp \
            canoodle.cpp \
            mainwindow.cpp \
    browser.cpp

HEADERS  += canoodle.h \
        mainwindow.h \
    browser.h

FORMS    += mainwindow.ui

LIBS+= -dead_strip
