export interface Repository<T> {
    find(id: string): T | undefined;

    save(domainObject: T): void;
}
