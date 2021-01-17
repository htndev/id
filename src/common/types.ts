export type GraphqlStatus = { status: number; message: string | null };

export type GraphqlResponse<T extends string> = { [k in T]: GraphqlStatus };
