import { Item } from "dynamoose/dist/Item";

export interface User extends Item {
    id: string;
    email: string;
}