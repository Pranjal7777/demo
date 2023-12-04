const cluster = require("cluster");
const debug = require("debug")("quiddity:server");
const http = require("http");
const numCPUs = require("os").cpus().length;
const port = process.env.PORT || "3005";
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const next = require("next");
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    server.disable("x-powered-by");
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.get("/", (req, res) => {
      // console.log("REGISER", register)
      // register();
      const actualPage = "/";
      const queryParams = { ...req.query } || {};
      app.render(req, res, actualPage, queryParams);
    });

    // edit model profile
    server.get("/model-edit-profile/:type?", (req, res) => {
      // console.log("REGISER", register)
      // register();
      const actualPage = "/model-edit-profile";
      const queryParams = { ...req.query, ...req.params } || {};
      app.render(req, res, actualPage, queryParams);
    });

    // edit model profile
    server.get("/profile/:type?", (req, res) => {
      // console.log("REGISER", register)
      // register();
      const actualPage = "/profile";
      const queryParams = { ...req.query, ...req.params } || {};
      app.render(req, res, actualPage, queryParams);
    });
    // document
    server.get("/document", (req, res) => {
      // console.log("REGISER", register)
      // register();
      const actualPage = "/document";
      const queryParams = { ...req.query } || {};
      app.render(req, res, actualPage, queryParams);
    });

    server.get("/home", (req, res) => {
      // console.log("REGISER", register)
      // register();
      const actualPage = "/home";
      const queryParams = { ...req.query } || {};
      app.render(req, res, actualPage, queryParams);
    });

    server.get("/registration", (req, res) => {
      // console.log("REGISER", register)
      // register();
      const actualPage = "/registration";
      const queryParams = { ...req.query, ...req.parqams } || {};
      app.render(req, res, actualPage, queryParams);
    });

    server.get("/reset-password", (req, res) => {
      const actualPage = "/reset-password";
      const queryParams = { ...req.query, ...req.params } || {};
      app.render(req, res, actualPage, queryParams);
    });

    //proxy notification icon to avoid adding prefixes
    server.get('/notification-icon.png', (req, res) => {
      res.set("Content-Type",'image/png');
      res.sendFile(path.join(__dirname, "public", `${process.env.NEXT_PUBLIC_BASE_PATH}/images/app_icons/icon-128x128.png`))
    })

    // server.get("/sitemap.xml", (req, res) => {
    //   // Don't cache service worker is a best practice (otherwise clients wont get emergency bug fix)
    //   res.set(
    //     "Cache-Control",
    //     "no-store, no-cache, must-revalidate, proxy-revalidate"
    //   );
    //   res.set("Content-Type", "application/xml");
    //   res.sendFile(path.join(__dirname, "sitemap.xml"));
    // });

    server.get(["/sitemap.xml", "/sitemap_image.xml", "/sitemap_post.xml", "/sitemap_static_home_page.xml", "/sitemap_user.xml", "/sitemap_video.xml"], async (req, res) => {
      // console.log("sitemap", req.url)
      const xmlRes = await fetch(`${process.env.NEXT_SITEMAP_URL}${req.url}`)
      const xml = await xmlRes.text()
      res.end(xml)
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

    server.get("*", (req, res) => {
      console.log("ipppppppppppppppppppp", req.header('x-forwarded-for'), req.socket.remoteAddress);
      return handle(req, res);
    });
    server.listen(port, (err) => {
      if (err) throw err;
      // console.log("> Development server ready on http://localhost:3001");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
