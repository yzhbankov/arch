import {parseSafeNull} from '../utils';

export interface IUseCase {
    run: (params: any) => Promise<any>;
    parse: (params: Record<string, any> | string) => Record<string, any>|null;
    execute: (params: any) => Promise<any>;
}

export class UseCaseBase implements IUseCase {
    async run(params: any): Promise<any> {
        const cleanParams = this.parse(params);
        if (cleanParams) {
            return this.execute(cleanParams);
        }
        return null;
    }

    parse(params: Record<string, any> | string): Record<string, any>|null {
        if (typeof params === 'string') {
            return parseSafeNull(params);
        }
        return params;
    }

    async execute(params: any): Promise<any> {
        return params;
    }
}
