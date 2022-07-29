import { Scalars, Maybe } from './types';
export type ErrorResponse = {
	__typename?: "ErrorResponse";
	data: null;
	error: Error;
};

export type Error = {
	__typename?: "Error";
	status: Scalars["Int"];
	message?: Maybe<Scalars["String"]>;
	name: Scalars["String"];
	details?: any;
};

export interface Session {
    id?:         number;
    identifier?: string;
    completed?:  boolean;
    createdAt?:  Date;
    updatedAt?:  Date;
    response?:   null;
    name?:       string;
    field?:      Field;
}

export interface Field {
    id:          number;
    name:        string;
    description: string;
    createdAt:   Date;
    updatedAt:   Date;
}
