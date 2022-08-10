# This file is generated automatically. Do not edit.
# Use project properties -> Build -> Qt -> Expert -> Custom Definitions.
TEMPLATE = app
DESTDIR = dist/Release/GNU-Linux
TARGET = SBT_Api
VERSION = 1.0.0
CONFIG -= debug_and_release app_bundle lib_bundle
CONFIG += debug 
PKGCONFIG +=
QT = core gui widgets network opengl
SOURCES += AlternativeAnalysisMultiYearNoESS.cpp AlternativeAnalysisMultiYearThread.cpp AlternativeAnalysisNoESS.cpp AlternativeAnalysisThread_1.cpp Application.cpp CreateToken.cpp DbConnector.cpp EmulatorThread.cpp ProcessRequest.cpp ProductionCostNoESS.cpp ProductionCostThread.cpp ProductionCostThreadNoEss.cpp ProductionCostThread_1.cpp SessionHandler.cpp SessionsDb.cpp StorageBenefitsThread.cpp TcpConnection.cpp TcpConnections.cpp TcpServer.cpp glpkLock.cpp main.cpp processMessage.cpp
HEADERS += AlternativeAnalysisMultiYearNoESS.h AlternativeAnalysisMultiYearThread.h AlternativeAnalysisNoESS.h AlternativeAnalysisThread.h Application.h CreateToken.h DbConnector.h EmulatorThread.h MessagesType.h ObjectDefinition.h ProcessRequest.h ProductionCostNoESS.h ProductionCostThread.h ProductionCostThreadNoEss.h ProductionCostThread_1.h SessionHandler.h SessionsDb.h StorageBenefitsThread.h TcpConnection.h TcpConnections.h TcpServer.h glpkLock.h
FORMS +=
RESOURCES +=
TRANSLATIONS +=
OBJECTS_DIR = build/Release/GNU-Linux
MOC_DIR = 
RCC_DIR = 
UI_DIR = 
QMAKE_CC = gcc
QMAKE_CXX = g++
DEFINES += 
INCLUDEPATH += /home/gonzales1609/IRENA/DbConnector 
LIBS += ../DbConnector/dist/Release/GNU-Linux/libdbconnector.a ../DbConnector/dist/Debug/GNU-Linux/libdbconnector.a  -Wl,-rpath,/home/gonzales1609/IRENA/DbConnector/dist 
equals(QT_MAJOR_VERSION, 4) {
QMAKE_CXXFLAGS += -std=c++11
}
equals(QT_MAJOR_VERSION, 5) {
CONFIG += c++11
}
