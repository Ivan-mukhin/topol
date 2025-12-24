const isDevelopment = import.meta.env.DEV;

export const logger = {
    error: (message: string, ...args: unknown[]) => {
        if (isDevelopment) {
            console.error(message, ...args);
        }
        // In production, send to error tracking service (Step 3.4)
    },
    warn: (message: string, ...args: unknown[]) => {
        if (isDevelopment) {
            console.warn(message, ...args);
        }
    },
    info: (message: string, ...args: unknown[]) => {
        if (isDevelopment) {
            console.info(message, ...args);
        }
    },
};






