import { CancelToken } from "axios";

export type ApiKey = string;

/** Custom settings object for per-request customization */
export interface Settings {
  /** Client API key */
  apiKey?: ApiKey;

  /** Override base url on a per request basis */
  url?: string;

  /** Force http in URL */
  useHttp?: boolean;

  /** If true, don't inject version into URL */
  noVersion?: boolean;

  /** Allow for request cancellation */
  signal?: CancelToken;

  /** Client API request timeout */
  timeout?: number;

  /** Apply credentials to request */
  // credentials?: boolean;
}
