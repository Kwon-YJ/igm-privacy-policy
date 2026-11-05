import type { Plugin } from "vite";
import { attendancePolicyDocument } from "../client/src/data/privacyPolicyAttendance";

export function attendancePolicyData(): Plugin {
  const body = JSON.stringify(attendancePolicyDocument);
  return {
    name: "attendance-policy-public-document",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "attendance-policy.json",
        source: body,
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
        response.end(request.method === "HEAD" ? undefined : body);
      });
    },
  };
}
