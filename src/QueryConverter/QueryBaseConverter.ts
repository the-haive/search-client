/**
 * Defines the base-class for the QueryConverter class, which adds a helper to simplify param-rendering.
 */
export class QueryBaseConverter {
    protected addParamIfSet(params: string[], key: string, param: any) {
        let value = param.toString();
        if (value) {
            params.push(`${key}=${encodeURIComponent(value)}`);
        }
    }
}
