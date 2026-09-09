from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 8000), QuietHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
