This is a Qt project to develop a desktop approximate to a smart TV app environment. The purpose is to enable rapid development and testing of HTML-based app for smart TVs on a desktop.

QT Libraries have been taken from http://download.qt-project.org/official_releases/qt/5.0/5.0.2/qt-windows-opensource-5.0.2-msvc2010_32-x86-offline.exe. 

##Building##

###Windows###

You need to download and install QT creator. Download from http://download.qt-project.org/official_releases/qt/5.0/5.0.2/qt-windows-opensource-5.0.2-msvc2010_32-x86-offline.exe. 

You need to download and install Visual C++ 2010 express. This coincides with the QT librarries downloaded. 

If you have a problem building then you will need to install 2010 express SP1

Download Visual C++ 2010 express from: http://www.microsoft.com/visualstudio/eng/downloads#d-2010-express

Double click on Canoodle of type QT project. This will start QT creator. 

Change configuration to release. 

Change install directory to coincide with the packaging script (or change the packaging script to coincide with o/p directory)

##Packaging##

You need to download and install Inno Setup. Download from http://www.jrsoftware.org/isdl.php#stable.

Browse to setup directory and double click on setup.iss. This will start the packager.
Change input executable file to coincide with output from build process.

Run will produce the setup.exe in output directory.
