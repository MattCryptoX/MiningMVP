/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as referral from "../referral.js";
import type * as schemas_referral from "../schemas/referral.js";
import type * as schemas_user from "../schemas/user.js";
import type * as schemas_userSettings from "../schemas/userSettings.js";
import type * as schemas_worker from "../schemas/worker.js";
import type * as user from "../user.js";
import type * as userSettings from "../userSettings.js";
import type * as utils from "../utils.js";
import type * as worker from "../worker.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  referral: typeof referral;
  "schemas/referral": typeof schemas_referral;
  "schemas/user": typeof schemas_user;
  "schemas/userSettings": typeof schemas_userSettings;
  "schemas/worker": typeof schemas_worker;
  user: typeof user;
  userSettings: typeof userSettings;
  utils: typeof utils;
  worker: typeof worker;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
