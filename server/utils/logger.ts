export const devLog =
  process.env.NODE_ENV === "development"
    ? (identifier: string, ...objects: any[]) => {
        process.env.NODE_ENV === "development";
        console.log("[dev]", identifier, ...objects);
      }
    : undefined;
