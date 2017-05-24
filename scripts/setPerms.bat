@echo Setting permissions
@icacls phat-win32-x64\* /q /c /t /reset >nul 2>&1
@icacls phat-win32-x64\* /grant Everyone:(OI)(CI)F /T >nul 2>&1
@echo Done setting permissions
