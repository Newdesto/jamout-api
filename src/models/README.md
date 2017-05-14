# HERE YE HERE YE.

## What's in this folder, dude?
In this folder are all of our models. Each model is has its
own folder, its own helper functions (index.js) and its own vogels definition (model.js).

We use a helper functions so we can wrap the vogel queries and, in some cases,
do some super-fancy computation (like hashing a string set) so it is ALWAYS
smart to use the helpers if they exist. If there are no helpers
it is safe to interact with the model directly.

## Is this where all the logic is stored?
Hell naaah, bro.

Most, if not all, helper functions in here are pure functions. They
should also NEVER call models outside of its folder. 

Helper functions should be as light as possible, they're usually wrappers. Most
of the logic should be in the resolvers or in a service class.

#### Peace.