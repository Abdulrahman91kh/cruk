import * as AWS from "aws-sdk";
import { contstructorArgsSES } from "./types/ses.types";

export default class EmailerSES {
    
	private readonly emails: string[];
	private readonly subject: string;
	private readonly body: string;
	private readonly source: string;
	private readonly ses: AWS.SES;

	constructor(mailObject: contstructorArgsSES) {
		({
			email: this.emails,
			subject: this.subject,
			body: this.body,
			ses: this.ses
		} = mailObject);
		this.source = mailObject.source || "no-reply@cruk.com";
	}

	public send() {
		const emailTemplate: AWS.SES.SendEmailRequest = this._generateEmailTemplate();
		return this.ses.sendEmail(emailTemplate).promise();
	}

	private _generateEmailTemplate() {
		return {
			Destination: {
				ToAddresses: this.emails
			},
			Message: {
				Body: {
					Html: {
						Charset: "UTF-8",
						Data: `<html><body><h3>CRUK Email</h3><p>${this.body}</p> <p>Best Wishes</p> <p>CRUK Team</p></body></html>`,
					},
					Text: {
						Charset: "UTF-8",
						Data: this.body,
					},
				},
				Subject: {
					Charset: "UTF-8",
					Data: this.subject,
				},
			},
			Source: this.source,
		};
	}
}