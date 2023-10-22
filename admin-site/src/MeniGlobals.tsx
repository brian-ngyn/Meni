export default function MeniGlobals() {
  const env = process.env.NODE_ENV;
  const globals = {
    apiRoot: "/",
    cdnRoot: "https://utfs.io/f/",
    webBase:
      env === "production" ? "https://meniapp.ca/" : "http://localhost:3000",
  };
  return globals;
}
