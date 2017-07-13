# IO
In this folder is anything related to external services or connections such as Redis, DynamoDB or API.ai. Everything in the IO folder is crucial for start up of the API. If the API fails on start up and you're sure that it's not GQL schema related (GQL schema errors will usually log before IO) then search this folder. This folder is also a good indicator of external dependencies. If one fails some part of our API will fail. Not much to it.

*See comments in the file for info on specific modules, bro.*
