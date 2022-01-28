interface Window {
    /**
     * Expose Environment versions.
     * @example
     * console.log( window.versions )
     */
    readonly versions: NodeJS.ProcessVersions;
    /**
     * Safe expose node.js API
     * @example
     * window.nodeCrypto('data')
     */
    readonly nodeCrypto: { sha256sum: any; };
    readonly api: { send: (channel: any, data: any) => void; receive: (channel: any, func: any) => void; };
}
