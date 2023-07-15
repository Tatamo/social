import {User} from "./user";
import {Image} from "./image";
import {Note} from "./note";

export type NestedActivityStreamObject<T> = Omit<T, "@context">;

export type ActivityStreamContext = [string, string, { [key: string]: string }?]; // TODO: add more detailed type

export type ActivityStreamPerson = {
    "@context": ActivityStreamContext;
    type: "Person";
    id: `${string}/users/${string}`;
    preferredUsername: string;
    name: string;
    url: string;
    summary: string;
    icon: string | Array<string> | NestedActivityStreamObject<ActivityStreamImage>;
    following: `${string}/users/${string}/following`;
    followers: `${string}/users/${string}/followers`;
    featured: `${string}/users/${string}/featured`;
    inbox: `${string}/users/${string}/inbox`;
    outbox: `${string}/users/${string}/outbox`;
    sharedInbox: `${string}/inbox`;
    discoverable: boolean;
    publicKey: {
        id: `${string}/users/${string}#main-key`;
        type: "Key";
        owner: `${string}/users/${string}`;
        publicKeyPem: string;
    }
    attachment: Array<{ type: "PropertyValue"; name: string; value: string }>;
};

export function ActivityStreamPersonFromDomainObject(user: User, publicKeyPem: string, icon: Image, opts: {
    protocol: string,
    host: string
}): ActivityStreamPerson {
    return {
        "@context": [
            "https://www.w3.org/ns/activitystreams",
            "https://w3id.org/security/v1",
            {
                "featured": "toot:featured",
                "discoverable": "toot:discoverable",
            }
        ],
        type: "Person",
        id: `${opts.protocol}${opts.host}/users/${user.name}`,
        preferredUsername: user.name,
        name: user.displayName,
        url: `${opts.protocol}${opts.host}/@${user.name}`,
        summary: user.summary,
        icon: {
            type: "Image",
            url: "https://gts.udon.zip/fileserver/01QN6PDCZN794E99NZTCG2K4JN/attachment/original/01VQGTQEH7RQA3C10VYWSSV677.png",
            sensitive: false
        },
        following: `${opts.protocol}${opts.host}/users/${user.name}/following`,
        followers: `${opts.protocol}${opts.host}/users/${user.name}/followers`,
        featured: `${opts.protocol}${opts.host}/users/${user.name}/featured`,
        inbox: `${opts.protocol}${opts.host}/users/${user.name}/inbox`,
        outbox: `${opts.protocol}${opts.host}/users/${user.name}/outbox`,
        sharedInbox: `${opts.protocol}${opts.host}/inbox`,
        discoverable: true,
        publicKey: {
            id: `${opts.protocol}${opts.host}/users/${user.name}#main-key`,
            type: "Key",
            owner: `${opts.protocol}${opts.host}/users/${user.name}`,
            publicKeyPem: publicKeyPem
        },
        attachment: user.properties.map(({name, value}) => ({type: "PropertyValue", name, value}))
    };
}

export type ActivityStreamImage = {
    "@context": ActivityStreamContext;
    type: "Image";
    name?: string;
    url: string;
    sensitive?: boolean;
};

export function ActivityStreamImageFromDomainObject(image: Image, opts: {
    protocol: string,
    host: string
}): ActivityStreamImage {
    return {
        "@context": [
            "https://www.w3.org/ns/activitystreams",
            "https://w3id.org/security/v1"
        ],
        type: "Image",
        name: image.name,
        url: image.url,
        sensitive: image.sensitive
    };
}

export type ActivityStreamNote = {
    "@context": ActivityStreamContext;
    type: "Note";
    id: string;
    attributedTo: string;
    to: string | Array<string>;
    content: string;
    source?: {
        content: string;
        mediaType: string;
    }
}

export function ActivityStreamNoteFromDomainObject(note: Note, opts: {
    protocol: string,
    host: string
}): ActivityStreamNote {
    return {
        "@context": [
            "https://www.w3.org/ns/activitystreams",
            "https://w3id.org/security/v1",
            {
                "@language": note.language
            }
        ],
        id: `${opts.protocol}${opts.host}/notes/note.id`,
        type: "Note",
        attributedTo: note.from,
        to: note.to,
        content: note.content,
    };
}
