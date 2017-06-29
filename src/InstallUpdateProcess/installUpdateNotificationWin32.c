#include <windows.h>

LRESULT CALLBACK WindowProc(HWND,UINT,WPARAM,LPARAM);

int WINAPI WinMain(HINSTANCE hInstance,HINSTANCE hPrevInst,LPTSTR lpCmdLine,int nShowCmd) 
{
    WNDCLASS wc = { };

    wc.lpfnWndProc   = WindowProc;
    wc.hInstance     = hInstance;
    wc.lpszClassName = "Window Class";

    RegisterClass(&wc);

    HWND hwnd = CreateWindowEx(0,wc.lpszClassName,"PHAT",WS_OVERLAPPEDWINDOW,CW_USEDEFAULT, CW_USEDEFAULT, 900, 100,NULL,NULL,hInstance,NULL);

    if(hwnd == NULL)
        return 0;

    ShowWindow(hwnd,nShowCmd);

    MSG msg = {};
    while(GetMessage(&msg,NULL,0,0))
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return 0;
}

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    switch (uMsg)
    {
        case WM_DESTROY:
            PostQuitMessage(0);
            return 0;
        break;
        
        case WM_PAINT:
            {
                PAINTSTRUCT ps;
                HDC hdc = BeginPaint(hwnd, &ps);

                HBRUSH brush = CreateSolidBrush((COLORREF)(RGB(255,255,255)));

                FillRect(hdc, &ps.rcPaint, brush);

                LPCTSTR text = "PHAT is updating. Do not close this window or shutdown your computer. This window will close automatically.";

                TextOut(hdc,0,0,text,lstrlen(text));

                EndPaint(hwnd, &ps);
            }
            return 0;
        break;

    }
    return DefWindowProc(hwnd,uMsg,wParam,lParam);
}
