declare module 'query-string' {
  declare type ParseOptions = {
    arrayFormat?: 'index' | 'bracket',
    encode?: boolean,
    strict?: boolean,
  };
  declare module.exports: {
    extract(str: string): string;
    parse(str: string, opts?: ParseOptions): Object;
    stringify(obj: Object, opts?: ParseOptions): string;
  };
};
