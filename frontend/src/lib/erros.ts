export class Error409 extends Error {
    constructor(msg: string) {
        super(msg)

        Object.setPrototypeOf(this, Error409.prototype)
    }
}

// throwEnvError
export function throwEnvError(envName: string): never {
    throw new Error(
        `Please define the ${envName} environment variable inside .env.local`,
    )
}
