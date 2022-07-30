import { generateMock } from './zod-mock';
import { z, ZodType } from 'zod';
import { random } from 'lodash';
import * as zodModels from '../zod';
import { __importDefault } from 'tslib';

// 1. Need to make an equivalent of the 'deepPartial' and 'deepOptional' methods from zod
// so we can make the data dirty
// 2. Randomiser function -- either long sentence or single sentence, etc
// 3. seed?

type MockRequestConfig = {
	maxDepth?: number;
	stringMap: Record<string, (...args: any[]) => string>;
};

type MockListRequestConfig = MockRequestConfig & {
	range: {
		from?: number;
		to?: number;
	};
};

const mockGetRequest = <T>(
	model: ZodType<T>,
	config?: MockRequestConfig
): T | undefined => {
	const { maxDepth = 6, stringMap } = config ?? {};

	const mock = generateMock(model, {
		maxDepth,
		stringMap,
	});

	return mock;
};

const mockListRequest = <T>(
	model: ZodType<T>,
	config?: MockListRequestConfig
): T[] => {
	const { maxDepth = 6, stringMap, range } = config ?? {};

	const count = random(range?.from ?? 1, range?.to ?? 10);

	const mocks = Array(count)
		.fill(null)
		.map(() =>
			generateMock(model, {
				stringMap,
				maxDepth,
			})
		);

	return mocks;
};

const mockPostRequest = <T>(
	model: ZodType<T>
): ((data: Partial<T>) => { data: Partial<T> }) => {
	const mutation = (data: Partial<z.infer<typeof model>>) => {
		return {
			data,
		};
	};

	return mutation;
};

const mock = mockListRequest(zodModels.PuppetMasterModel);
console.log(mock);

const mutation = mockPostRequest(zodModels.PuppetMasterModel);
