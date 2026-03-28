/**
 * Estrae un messaggio leggibile dal payload di errore Eden/Treaty (body JSON o Eccezione).
 */
function errorBodyMessage(value: unknown): string | undefined {
  if (value == null || typeof value !== "object") return undefined;
  const rec = value as Record<string, unknown>;
  const err = rec.error;
  if (typeof err === "string" && err.trim()) return err;

  const message = rec.message;
  if (typeof message === "string" && message.trim()) return message;
  return undefined;
}

export function assertTreatyValue<TData>(result: {
  data: TData;
  error: unknown;
  status: number;
}): NonNullable<TData> {
  if (result.error != null) {
    const fromBody =
      typeof result.error === "object" &&
      result.error !== null &&
      "value" in result.error
        ? errorBodyMessage((result.error as { value?: unknown }).value)
        : undefined;

    if (fromBody) throw new Error(fromBody);
    if (result.error instanceof Error) throw result.error;

    throw new Error(`Richiesta non riuscita (${result.status})`);
  }

  if (result.data == null || result.data === undefined)
    throw new Error(`Richiesta non riuscita (${result.status})`);

  return result.data;
}
