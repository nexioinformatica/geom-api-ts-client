import { Settings } from "../../src/common/api";

export const makeSettings = (token: string) => (url: string) => <T>(props: T): {token: string; settings: Settings } & T => ({ token: token, settings: { url: url }, ...props });
