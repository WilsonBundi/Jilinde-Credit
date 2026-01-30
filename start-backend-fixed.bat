@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.1.8-hotspot
set PATH=%PATH%;C:\Users\HomePC\Downloads\apache-maven-3.9.12-bin\apache-maven-3.9.12\bin
cd backend
mvn spring-boot:run