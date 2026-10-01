@rem Gradle wrapper launcher for Windows.
@rem Falls back to an installed Gradle if gradle-wrapper.jar is missing.
@echo off
setlocal
set APP_HOME=%~dp0
set WRAPPER_JAR=%APP_HOME%gradle\wrapper\gradle-wrapper.jar
if exist "%WRAPPER_JAR%" (
  if defined JAVA_HOME (
    "%JAVA_HOME%\bin\java.exe" -Dorg.gradle.appname=gradlew -classpath "%WRAPPER_JAR%" org.gradle.wrapper.GradleWrapperMain %*
  ) else (
    java -Dorg.gradle.appname=gradlew -classpath "%WRAPPER_JAR%" org.gradle.wrapper.GradleWrapperMain %*
  )
  exit /b %ERRORLEVEL%
)
where gradle >nul 2>nul
if %ERRORLEVEL%==0 (
  echo gradle-wrapper.jar not found - using installed Gradle.
  gradle %*
  exit /b %ERRORLEVEL%
)
echo ERROR: gradle-wrapper.jar is missing and Gradle is not installed.
echo Fix: open the backend folder in IntelliJ, or install Gradle 8.x and run:
echo     gradle wrapper --gradle-version 8.10.2
exit /b 1
