import sys
import socket
from http.server import HTTPServer, SimpleHTTPRequestHandler

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def hide_console_window():
    if sys.platform == "win32" and "--no-hide" not in sys.argv:
        try:
            import ctypes
            hwnd = ctypes.windll.kernel32.GetConsoleWindow()
            if hwnd:
                process_list = (ctypes.c_uint * 2)()
                num_procs = ctypes.windll.kernel32.GetConsoleProcessList(process_list, 2)
                if num_procs <= 2 or "--hide" in sys.argv:
                    ctypes.windll.user32.ShowWindow(hwnd, 0)
        except Exception:
            pass

if __name__ == '__main__':
    port = 8000
    server = HTTPServer(('0.0.0.0', port), QuietHandler)
    local_ip = get_local_ip()
    print("==================================================")
    print("  TOUKIR STUDIO PORTFOLIO — LIVE SERVER")
    print(f"  Local URL:        http://localhost:{port}/")
    print(f"  Network (Phone):  http://{local_ip}:{port}/")
    print("==================================================")
    print("Press Ctrl+C to stop the server.")
    hide_console_window()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
