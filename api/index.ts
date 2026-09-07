// @ts-ignore - produced dist/server.js is generated at build time and not part of TS declarations
const appModule = await import("../dist/server.js");
const app = (appModule as any).default as any;

app.use((req: any, res: any, next: any) => {
  if (req.url && req.url.startsWith("/api")) {
    req.url = req.url.replace(/^\/api/, "") || "/";
  }

  next();
});

export default app;
