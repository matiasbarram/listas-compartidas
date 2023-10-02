export class Error409 extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, Error409.prototype);
    }
}