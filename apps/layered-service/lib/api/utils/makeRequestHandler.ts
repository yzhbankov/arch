import {IUseCase} from '../../usecases';

export type MapToParamsType = (params: any) => Record<string, any>;
export type RequestHandlerType = (message: Record<string, any>) => Promise<void>;

async function runUseCase(UseCase: new () => IUseCase, {params}: { params: any }) {
    return new UseCase().run(params);
}

export default function makeRequestHandler(
    UseCase: new () => IUseCase,
    mapToParams: MapToParamsType,
): RequestHandlerType {
    function logRequest(params: Record<string, any>, result: Record<string, any>, startTime: number) {
        console.log({
            useCase: UseCase.name,
            runtime: Date.now() - startTime,
            params,
            result,
        });
    }

    return async function routerHandler(message: Record<string, any>) {
        try {
            const startTime = Date.now();
            const params = mapToParams(message);

            const result = await runUseCase(UseCase, {params});

            // logRequest(params, result, startTime);
        } catch (err: any) {
            console.error(err);
        }
    };
}
