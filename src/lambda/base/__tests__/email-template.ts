export default function getEmailTemplate({body, email, subject, source}: any){
	return {
		Destination: {
			ToAddresses: email
		},
		Message: {
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: `<html><body><h3>CRUK Email</h3><p>${body}</p> <p>Best Wishes</p> <p>CRUK Team</p></body></html>`,
				},
				Text: {
					Charset: "UTF-8",
					Data: body,
				},
			},
			Subject: {
				Charset: "UTF-8",
				Data: subject,
			},
		},
		Source: source,
	};
}