export type Vowel = '-i' | 'a' | 'o' | 'e' | '^e' | 'i' | 'u' | 'v' | 'er' | 'ai' | 'ei' | 'ao' | 'ou' | 'an' | 'en' | 'n' | 'ang' | 'eng' | 'ong' | 'ing';

export enum VowelMode{
    Similar,
    Same,
}

export function convertVowelMode(s: string){
    switch(s){
        case 'same': return VowelMode.Same;
        default: return VowelMode.Similar;
    }
}

export enum WordMode{
    Any,
    Head,
    Tail,
}

export function convertWordMode(s: string){
    switch(s){
        case 'head': return WordMode.Head;
        case 'tail': return WordMode.Tail;
        default: return WordMode.Any;
    }
}

export interface QueryRequest{
    library: string,
    vowel: Vowel[],
    vowelMode: VowelMode,
    wordInclude: string[],
    wordIncludeMode: WordMode,
    wordExclude: string[],
    wordExcludeMode: WordMode,
    queryNumber: number,
    accessKey: string,
}

export enum QueryResponseStatus{
    OK,
    PermissionDenied,
    QueryNumberLimitExceeded,
    FormatError,
    ServerError,
}

export interface QueryResponseBody{
    line: string,
    pinyin: string,
    vowel: string,
    title: string,
    author?: string,
    id?: number,
}

export type QueryResponse = {
    status: QueryResponseStatus.OK,
    body: QueryResponseBody[],
} | {
    status: Exclude<QueryResponseStatus, QueryResponseStatus.OK>,
    message: string,
}