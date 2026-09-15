// ─── Type utilities for the i18n system ────────────────────────────────────
import type { en } from './en/index';

/**
 * Messages: the shape of the English source-of-truth,
 * but with every leaf widened to `string`.
 */
export type Messages = DeepStringify<typeof en>;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? DeepStringify<T[K]>
    : string;
};

/**
 * MessageKey: every dotted path through the Messages tree.
 * e.g. "common.appName" | "triage.result.title" | ...
 */
export type MessageKey = DottedPaths<Messages>;

type DottedPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DottedPaths<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

/**
 * ExtractVars<S>: pulls out every {token} from a string literal.
 * If S is just `string` (widened), returns Record<string, string>.
 */
export type ExtractVars<S extends string> =
  string extends S
    ? Record<string, string>
    : _ExtractVars<S>;

type _ExtractVars<S extends string> =
  S extends `${string}{${infer Var}}${infer Rest}`
    ? { [K in Var | keyof _ExtractVars<Rest>]: string }
    : Record<never, never>;

/**
 * Resolve a dotted key path back to its leaf value type in Messages.
 */
export type Resolve<
  T,
  Path extends string,
> = Path extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? Resolve<T[Head], Tail>
    : never
  : Path extends keyof T
  ? T[Path]
  : never;
