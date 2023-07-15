export type User = {
    /**
     * unique, not changeable string and same as the userpart of the `acct` URL
     * this is NOT same as `user` member in Actor, but same as `preferredUsername`
     */
    name: string;

    /**
     * same as `name` member in Actor
     */
    displayName: string;

    language: string;

    summary: string;

    properties: Array<{ name: string, value: string }>;
}
