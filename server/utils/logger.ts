export function devLog(identifier: string, ...objects: any[]) {
  process.env.NODE_ENV === "development" || console.log(identifier, ...objects);
}
