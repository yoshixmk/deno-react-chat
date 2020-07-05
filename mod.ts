import baseServer from "./react-base-server.tsx";
import { websocketServer } from "./src/websockets/server.ts";
import args from "https://deno.land/x/args@2.0.2/wrapper.ts";
import {
  EarlyExitFlag,
  PartialOption,
} from "https://deno.land/x/args@2.0.2/flag-types.ts";
import {
  FiniteNumber,
  Text,
} from "https://deno.land/x/args@2.0.2/value-types.ts";
import {
  PARSE_FAILURE,
} from "https://deno.land/x/args@2.0.2/symbols.ts";

const DEFAULT_PORT = 5000;
const WEB_SOCKET_DEFAULT_PORT = 8080;
const DEFAULT_HOSTNAME = "127.0.0.1";

const parser = args
  .describe("deno-react-chat is the tabletop game using Web server and Websocket")
  .with(
    EarlyExitFlag("help", {
      describe: "Show help",
      alias: ["h"],
      exit() {
        console.log(parser.help());
        return Deno.exit();
      },
    }),
  )
  .with(
    PartialOption("web_port", {
      type: FiniteNumber,
      describe: `Port of web socket (default: ${DEFAULT_PORT})`,
      alias: ["web"],
      default: DEFAULT_PORT,
    }),
  )
  .with(
    PartialOption("ws_port", {
      type: FiniteNumber,
      describe: `Port of web socket (default: ${WEB_SOCKET_DEFAULT_PORT})`,
      alias: ["ws"],
      default: WEB_SOCKET_DEFAULT_PORT,
    }),
  ).with(
    PartialOption("hostname", {
      type: Text,
      describe: `Web server's hostname (default: $DEFAULT_HOSTNAME)`,
      alias: ["host"],
      default: DEFAULT_HOSTNAME,
    }),
  );

const res = parser.parse(Deno.args);

if (res.tag === PARSE_FAILURE) {
  console.error("Failed to parse CLI arguments");
  console.error(res.error.toString());
  Deno.exit(1);
}

const { web_port, ws_port, hostname } = res.value;

// start react server for websocket frontend
baseServer({
  appModulePath: "./src/front_end/app.tsx",
  port: web_port,
  wsPort: ws_port,
  hostname: hostname,
});

// start websocket server
websocketServer(ws_port);
