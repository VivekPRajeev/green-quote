export function logRequest({ method, url }: { method: string; url: string }) {
  console.log(
    JSON.stringify({
      level: 'info',
      type: 'request',
      method,
      url,
      timestamp: new Date().toISOString(),
    })
  );
}

export function logResponse({ status, url }: { status: number; url: string }) {
  console.log(
    JSON.stringify({
      level: 'info',
      type: 'response',
      status,
      url,
      timestamp: new Date().toISOString(),
    })
  );
}

export function logError({ error, url }: { error: unknown; url: string }) {
  console.error(
    JSON.stringify({
      level: 'error',
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
      url,
      timestamp: new Date().toISOString(),
    })
  );
}
