export class CustomError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        
        // This is necessary when extending built-in classes in TypeScript
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}