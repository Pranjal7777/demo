const cluster = require("cluster");
const debug = require("debug")("quiddity:server");
const http = require("http");
const numCPUs = require("os").cpus().length;
const port = process.env.PORT || "3001";
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const next = require("next");
const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();
var compression = require("compression");

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(compression());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    //proxy notification icon to avoid adding prefixes
    server.get('/notification-icon.png', (req, res) => {
      res.set("Content-Type", 'image/png');
      res.sendFile(path.join(__dirname, "public", `${process.env.NEXT_PUBLIC_BASE_PATH}/images/app_icons/icon-128x128.png`))
    })

    // server.get("/sitemap_index.xml", (req, res) => {
    //   // Don't cache service worker is a best practice (otherwise clients wont get emergency bug fix)
    //   res.set(
    //     "Cache-Control",
    //     "no-store, no-cache, must-revalidate, proxy-revalidate"
    //   );
    //   res.set("Content-Type", "application/xml");
    //   res.sendFile(path.join(__dirname, "sitemap_index.xml"));
    // });

    server.get(["/sitemap.xml", "/sitemap_image.xml", "/sitemap_post.xml", "/sitemap_static_home_page.xml", "/sitemap_user.xml", "/sitemap_video.xml"], async (req, res) => {
      // console.log("sitemap", req.url)
      const xmlRes = await fetch(`${process.env.NEXT_SITEMAP_URL}${req.url}`)
      const xml = await xmlRes.text()
      res.end(xml)
    })

    server.get("/health-check", async (req, res) => {
      res.end("success")
    })

    server.get("/firebase-messaging-sw.js", async (req, res) => {
      // Don't cache service worker is a best practice (otherwise clients wont get emergency bug fix)
      res.sendFile(path.join(__dirname, "public", "firebase-messaging-sw.js"));
    });

    server.get("/sw.js", (req, res) => {
      res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      res.set("Content-Type", "application/javascript");
      res.sendFile(path.join(__dirname, "public", "sw.js"));
    });

    server.get("/robots.txt", (req, res) => {
      // Don't cache service worker is a best practice (otherwise clients wont get emergency bug fix)
      res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      res.set("Content-Type", "text/plain");
      res.sendFile(path.join(__dirname, "public", "robots.txt"));
      // res.send("google.com, pub-6604908833616507, DIRECT, f08c47fec0942fa0");
    });
    server.get("*", (req, res) => {
      console.log("ipppppppppppppppppppp", req.headers, req.socket.remoteAddress);
      return handle(req, res);
    });
    if (false) {
      server.listen(port, (err) => {
        if (err) throw err;
        // console.log("> Development server ready on http://localhost:3001");
      });
    } else {
      server.set("port", port);

      if (cluster.isMaster) {
        for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
        }

        cluster.on("exit", (worker, code, signal) => {
          // console.log("Worker " + worker.process.pid + " died.");
          cluster.fork();
        });

        cluster.on("listening", (worker, address) => {
          // console.log("Worker started with PID " + worker.process.pid + ".");
        });
      } else {
        let ns = http.createServer(server);

        ns.listen(port);

        ns.on("error", (error) => {
          if (error.syscall !== "listen") {
            throw error;
          }

          const bind =
            typeof port === "string" ? "Pipe " + port : "Port " + port;

          switch (error.code) {
            case "EACCES":
              console.error(bind + " requires elevated privileges");
              process.exit(1);
              break;
            case "EADDRINUSE":
              console.error(bind + " is already in use");
              process.exit(1);
              break;
            default:
              throw error;
          }
        });

        ns.on("listening", () => {
          const addr = ns.address();
          const bind =
            typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
          debug("Listening on " + bind);
        });
      }
    }
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
