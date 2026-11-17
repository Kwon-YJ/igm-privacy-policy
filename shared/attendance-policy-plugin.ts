import { readFileSync } from "node:fs";
import type { Plugin } from "vite";

const policyFile = new URL(
  "../client/src/data/attendance-policy.json",
  import.meta.url
);

export function attendancePolicyData(): Plugin {
  return {
    name: "attendance-policy-public-document",
    generateBundle() {
      // Emit the issued bytes as-is so the published SHA-256 stays identical
      // to the reviewed source document.
      this.emitFile({
        type: "asset",
        fileName: "attendance-policy.json",
        source: readFileSync(policyFile),
      });
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?")[0] !== "/attendance-policy.json")
          return next();
        if (!["GET", "HEAD"].includes(request.method ?? "")) {
          response.writeHead(405, { Allow: "GET, HEAD" });
          response.end();
          return;
        }
        response.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        });
        response.end(
          request.method === "HEAD" ? undefined : readFileSync(policyFile)
        );
      });
    },
  };
}
