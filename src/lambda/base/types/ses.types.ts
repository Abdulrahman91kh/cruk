import { SES } from "aws-sdk";

export interface contstructorArgsSES {
    email: string[];
	body: string;
	subject: string;
    source?: string;
    ses: SES;
}