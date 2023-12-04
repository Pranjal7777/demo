import Document, { Html, Head, Main, NextScript } from "next/document";
import { PRIMARY_COLOR } from "../lib/color";
import {
  APP_NAME,
  DESCRIPTION,
  FAV_ICON16,
  FAV_ICON36,
  APP_ICON,
  DEFAULT_LANGUAGE
} from "../lib/config/creds";
import { SheetsRegistry, JssProvider, createGenerateId } from "react-jss";
import { ServerStyleSheet } from 'styled-components'
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    const registry = new SheetsRegistry();
    const generateId = createGenerateId();
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(
              <JssProvider registry={registry} generateId={generateId}>
                <App {...props} />
              </JssProvider>
            ),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        userTheme: ctx.req.cookies.userTheme,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            <style id="server-side-styles">{registry.toString()}</style>
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
  render() {
    const APPNAME = APP_NAME;
    const DESC = DESCRIPTION;
    const IMAGE = APP_ICON;
    const TITLE = APP_NAME;
    const userTheme = this.props.userTheme || "light" //put default theme here
    return (
      <Html lang={DEFAULT_LANGUAGE}>
        <Head>
          <meta name="robots" content="noindex" />
          <meta charSet="UTF-8"></meta>
          <link rel="icon" href={IMAGE} type="image/png" sizes="16x16"></link>
          <meta name="application-name" content={APPNAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={TITLE} />
          <meta name="description" content={DESC} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content={PRIMARY_COLOR} />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content={PRIMARY_COLOR} />
          <link rel="apple-touch-icon" sizes="180x180" href={IMAGE} />
          <link rel="icon" type="image/png" sizes="32x32" href={FAV_ICON16} />
          <link rel="icon" type="image/png" sizes="16x16" href={FAV_ICON36} />
          <link
            rel="manifest"
            href={process.env.NEXT_PUBLIC_BASE_PATH + "/manifest.json"}
          />
          {/* <link
            href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900&display=swap"
            rel="stylesheet"
          /> */}
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@200;300;400;500;600;700;800&family=Roboto:wght@100;300;400;500;700;900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans:wght@200;300;400;500;600;700;800&family=Roboto:wght@100;300;400;500;700;900&display=swap"
            rel="stylesheet"
          />
          <link rel="shortcut icon" href={FAV_ICON36} />
          <script src="/js/fingerprint.js" type="text/javascript"></script>
          <script src="/js/jquery.min.js" defer="defer"></script>
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js "
            defer="defer"
          ></script>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@200;300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <script
            src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
            defer="defer"
          ></script>
          <script src="/disableKeys.js"></script>
        </Head>
        <body
          // className={userTheme === "dark" ? "dark_theme" : ""}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;
