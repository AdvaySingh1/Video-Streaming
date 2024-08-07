Hello World.

Tech Stack:

- FFmpeg
- Node JS (look at [text](Video-PS/package.json)) for versioning and dependencies.

More on Node...

- V8 is locally downloaded and wrapped with C++ for CLI usage which Node leverages in it's scripts.
- Dev deps such as type script and it's types will not be used in production.
- Modules and dependencies are similar. We can also create these so long as they have exports.
- Package-lock is for the versioning of the dependencies.
- Node checks ~./zshrc cofig file for dependencies. All our deps need to be installed in our device for usage.
- If dependencies use npx, then if the dep isn't found, it is added to local cache for temp usage.
- Use npx for testing modules: npx jest --init for test framework.

Networking knowledge:
LEVELS OF NETWORKING

- Application
- Frameworks and bundlers which bundle all the public code into JS and deliver it as a response on the client side.
- We have our JS which is compiled by our local C++ wrapped V8 on the server side. These things run on our servers and here’s is where the logic happens including ML, and other middleware. (usually where containerization and orchestration of micro services is handled).
- Then we have express module which uses HTTP module from node to create an intuitive server API. (usually where big data and distributed system tech is handled).
- Then we have the HTTP module which uses the .net Node module which.
- Then we have the .net node module which is C++ for TCP networking written in C++.
- Then at the lowest level of software, we are working with the OS network stack and IP addresses.
- Hardware.

- Daemon: program which runs in the background (Cros, OS related C++ which express framework is built off of).

- Using curl for POST requests:
  curl -X POST http://localhost:3001/process-video \
   -H "Content-Type: application/json" \
   -d '{"inputFilePath": "hello.MOV", "outputFilePath": "processed-hello.MOV"}'

More JS in Node context:

- Call back is the same as route handlers and are the function in the perameter of the other funtion.
- Not always async unless attatched with a promise or other callbacks.
- Passed into Node JS's single threded event loop.

- Docker: https://docs.docker.com/guides/docker-overview/
- Dockerfile: https://docs.docker.com/reference/dockerfile/
- Docker CLI: https://docs.docker.com/reference/cli/docker/container/cp/
- Docker API: https://docs.docker.com/engine/api/sdk/
- Dokerd: the docker daemon which runs in the background allowing you to images.
  - CLI: https://docs.docker.com/reference/cli/dockerd/
