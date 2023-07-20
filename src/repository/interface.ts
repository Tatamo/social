export interface Repository<T> {
    save(domainObject: T): void;
}
