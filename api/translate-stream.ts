

export const warmupServerConnection = async (url: string = '/api/translate-stream', timeout: number = 1000) => {
	try {
	  await fetch(url, { 
		method: 'HEAD',
		signal: AbortSignal.timeout(timeout) // Quick timeout for warmup
	  });
	} catch (error: unknown) {
	  if (error instanceof Error) {
		console.error('API warmup error:', error.message);
	  } else {
		console.error('API warmup error:', error);
	  }
	  // Ignore warmup errors - this is just optimization
	  console.debug('API warmup completed');
	}
  };