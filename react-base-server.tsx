import {
  opine,
  React,
  ReactDOMServer,
} from "./deps.ts";

const browserBundlePath = "/browser.js";

const baseServer = async ({
  appModulePath,
  port,
  wsPort,
  hostname,
}: Readonly<{
  appModulePath: string;
  port: number;
  wsPort: number;
  hostname: string;
}>) => {
  const app = opine();

  const { default: App } = await import(appModulePath);

  const js =
    `import React from "https://dev.jspm.io/react@16.13.1";\nimport ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";\nconst App = ${App};\nReactDOM.hydrate(React.createElement(App, {wsPort: ${wsPort}, hostname: '${hostname}'}, null), document.body);`;

  const html =
    `<html><head><script type="module" src="${browserBundlePath}"></script><style>* { font-family: Helvetica; }</style></head><body>${
      (ReactDOMServer as any).renderToString(<App wsPort={wsPort} hostname={hostname} />)
    }</body></html>`;

  app.use(browserBundlePath, (req, res, next) => {
    res.type("application/javascript").send(js);
  });

  app.use("/", (req, res, next) => {
    res.type("text/html").send(html);
  });

  app.listen({ port });

  return app;
};

export default baseServer;
