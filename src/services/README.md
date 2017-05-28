# Services
A service is an independent part of the Jamout platform. Services should do all or most of the following:
	- Export helper functions for GraphQL queries and mutations.
	- Register as SQS consumers.
	- Manage its own models.
	- Publish events to GraphQL subscriptions.
	- Publish messages to SNS.

Best practices and stuffs for service-to-service communication:
	- Services are NOT aware of each other when it comes to business logic. E.g.; the `chat` service is not aware that there is a `bot` service and vice-versa. Instead, they react to  messages that the other publishes.
	
	Any important attributes should be published with the message itself, but if up to date data or entire objects are needed it’s okay for services to query each other.

	- It might be tempting when building the first iterations of services, but services should NEVER access the models of another service.
	- Permission checks should be done before a message is published.

#### Service List:
	1. `iam` 
		- User accounts and profiles
		- Roadmap: user groups + permission policies
	2. `chat`
		- Channels, Subscriptions, and Messages
		- Not concerned with bot logic or NLP
	3. `bot`
		- NLP via API.ai
	4. `onboarding`???
	5. `Distribution`