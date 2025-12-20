export class CalculationError extends Error {
    public readonly gunName?: string;
    constructor(message: string, gunName?: string) {
        super(message);
        this.name = 'CalculationError';
        this.gunName = gunName;
    }
}

export class ValidationError extends Error {
    public readonly field?: string;
    constructor(message: string, field?: string) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

export class DataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DataError';
    }
}

