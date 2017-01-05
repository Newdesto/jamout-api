# distribution:new
There’s a concurrency issue when we stuff the entire dialog of a nonlinear conversation into one worker. Since we utilize `await` it causes the worker to pause until the client sends a postback. As a result, similar jobs in the queue are delayed until the paused worker is done.

**A worker should never use await**

To solve this issue we break down the giant nonlinear worker into several smaller jobs, each job triggers the next. It’s still a nonlinear dialog, except each intent is processed in a separate worker.

### Scalability Note
Background workers pose a scalability issue, since Kue only runs one worker by default. There is the option to run one worker per core, but even then that’s not enough for hundreds of concurrent users. Furthermore, it’s not a good idea to process several jobs at once because of contextual issues.

Node isn’t the best with concurrency or CPU intensive operations, but it is great for IO.

A few solutions:
	* Multiple machines running Kue with concurrent workers
	* Alternative javascript library
	* Move to Go (amazing concurrency)
	* Move to another framework or language
