# Workers
The worker folder houses all of the workers for Jamout. We use  [Kue](https://github.com/Automattic/kue) to orchestrate jobs and  [Redis](https://redis.io) to store messages. Ideally, workers should have dedicated nodes, but in the spirit of “lean” methodologies they’re paired with the GQL service.

Workers are expected to do things that don’t  need to be executed immediately. Jobs are created to increases performance for clients. Processes such as querying or creating can be done in the resolvers of GQL, but any process that doesn’t need to be carried out immediately can be passed to the workers.

This creates a point of failure and means we need to carefully decide what should be processed in a worker and would should be processed on the spot. If a job fails can we do without it until it is tried again? If a job fails can notify a human? If a job fails because of a service provider what do we do?

## Todos
	* Job data is not automatically deleted from Redis so eventually our Redis instance won’t be able to handle it. Depending on the job type, it might make more sense to log job data (obviously not secure data) and store the logs. This will allow us to do weekly Redis cleanups.
