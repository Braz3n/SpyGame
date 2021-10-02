import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

class QrHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("spyboy.html")

def make_app():
    app_settings = dict(
        template_path = "templates",
        static_path = "static",
        debug = True
    )
    return tornado.web.Application([
        # (r"/", MainHandler),
        (r"/", QrHandler),
        # (r"/favicon.ico", tornado.web.StaticFileHandler, {"path": "static/img/"})
    ],
    **app_settings)

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()

# def create_app(test_config=None, *args, **kwargs):
#     # create and configure the app
#     app = Flask(__name__, instance_relative_config=True)
#     app.config.from_mapping(
#         SECRET_KEY='zamQeXN67jtm',  # cat /dev/urandom | base64 | head -c 12
#         DATABASE=''
#     )

#     from . import page
#     app.register_blueprint(page.bp)

#     return app