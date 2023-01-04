import { Item } from "dynamoose/dist/Item";

export interface CreateDonation {
    userId: string;
    amount: number;
}

export interface Donation extends Item{
    id: string;
    userId: string;
    amount: number;
    createdAt?: number;
}