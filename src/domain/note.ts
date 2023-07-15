export type Note = {
    id: string;
    from: string;
    to: string | Array<string>;
    content: string;
    language: string;
}
