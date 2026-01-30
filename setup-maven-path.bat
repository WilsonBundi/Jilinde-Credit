@echo off
echo Adding Maven to PATH...
echo.

echo Searching for Maven installation...

REM Check common Maven locations
set MAVEN_PATH=
if exist "C:\Program Files\Apache\maven\bin\mvn.cmd" set MAVEN_PATH=C:\Program Files\Apache\maven\bin
if exist "C:\apache-maven-3.9.6\bin\mvn.cmd" set MAVEN_PATH=C:\apache-maven-3.9.6\bin
if exist "C:\apache-maven-3.9.5\bin\mvn.cmd" set MAVEN_PATH=C:\apache-maven-3.9.5\bin
if exist "C:\apache-maven-3.9.4\bin\mvn.cmd" set MAVEN_PATH=C:\apache-maven-3.9.4\bin
if exist "C:\maven\bin\mvn.cmd" set MAVEN_PATH=C:\maven\bin

if "%MAVEN_PATH%"=="" (
    echo Maven not found in common locations.
    echo Please tell me where you extracted Maven.
    echo.
    echo Common locations:
    echo   C:\Program Files\Apache\maven
    echo   C:\apache-maven-3.x.x
    echo   C:\maven
    echo.
    set /p CUSTOM_PATH="Enter the full path to your Maven folder: "
    set MAVEN_PATH=%CUSTOM_PATH%\bin
)

echo Found Maven at: %MAVEN_PATH%
echo.

echo Testing Maven...
"%MAVEN_PATH%\mvn.cmd" -version
if %errorlevel% neq 0 (
    echo Maven test failed. Please check the path.
    pause
    exit /b 1
)

echo.
echo Adding to PATH...
setx PATH "%PATH%;%MAVEN_PATH%"

echo.
echo Maven has been added to your PATH!
echo Please close and reopen your command prompt/PowerShell.
echo Then test with: mvn -version
echo.
pause