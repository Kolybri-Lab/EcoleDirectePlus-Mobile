export const isDev =
    typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production";

export const logger = {
    log: (...args: any[]) => {
        if (isDev) {
            console.log(...args);
        }
    },
    info: (...args: any[]) => {
        if (isDev) {
            console.info(...args);
        }
    },
    warn: (...args: any[]) => {
        if (isDev) {
            console.warn(...args);
        }
    },
    error: (...args: any[]) => {
        console.error(...args);
    },
    debug: (...args: any[]) => {
        if (isDev) {
            console.debug(...args);
        }
    },
};

/**
 * Neutralise globalement console.log, console.debug et console.info en production
 * afin d'éviter toute fuite de données ou impact sur les performances.
 */
export function initLogger() {
    if (!isDev) {
        console.log = () => {};
        console.debug = () => {};
        console.info = () => {};
    }
}

export default logger;

