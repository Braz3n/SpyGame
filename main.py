import tornado.ioloop
import tornado.web
import tornado.gen

class TeacherHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("teacher.html")

class QrHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("spyboy.html")

class VaultHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("vault.html")

class AudioQuestionHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("audio_question.html")

class ReflectionHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("reflection.html")

class ResourcesHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("resources.html")

class ResourcesZipHandler(tornado.web.RequestHandler):
    async def get(self):
        chunk_size = 1024*1024*1  # 1MB
        with open("./static/resources.zip", "rb") as f:
            while True:
                chunk = f.read(chunk_size)
                try:
                    if len(chunk) == 0:
                        break
                    self.write(chunk)
                    await self.flush()
                except tornado.iostream.StreamClosedError:
                    print("Closed")
                    break
                finally:
                    del chunk
                    # pause the coroutine so other handlers can run
                    await tornado.gen.sleep(0.000000001) # 1 nanosecond

def make_app():
    app_settings = dict(
        template_path = "templates",
        static_path = "static",
        debug = False
    )
    return tornado.web.Application([
        # (r"/", MainHandler),
        (r"/", QrHandler),
        (r"/vault", VaultHandler),
        (r"/teacher", TeacherHandler),
        (r"/question", AudioQuestionHandler),
        (r"/reflection", ReflectionHandler),
        (r"/resources", ResourcesHandler),
        (r"/spygame.zip", ResourcesZipHandler)
    ],
    **app_settings)

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
