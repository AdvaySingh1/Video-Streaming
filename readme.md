Hello World.

Tech Stack:

- FFmpeg: Video Processing.
- Node JS (look at [package.json](Video-PS/package.json)) for versioning and dependencies: JS Runtime.
- Express JS: Running Server (using JSON middleware).
- Docker: Containerization.
- Google Cloud Storage: Object storage.
- Google Cloud Run: Serverless container platform for hosting.
- Google Pub Sub for asynchronous messaging and Post endpoint.
- Next.JS for application development (React Wrapper). See [package.json](yt-web-client/package.json) for dependencies.
- Firebase (backend as a service).
- Firestore (noSQL cloud databases).

More on Node...

- [V8](https://github.com/v8/v8) is locally downloaded and wrapped with C++ for CLI usage which Node leverages in it's scripts.
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

  - SSH uses Daemon to connect to other server. Ex. SSH into Github Repository.

- Using curl for POST requests:
  curl -X POST http://localhost:3001/process-video \
   -H "Content-Type: application/json" \
   -d '{"inputFilePath": "hello.MOV", "outputFilePath": "processed-hello.MOV"}'

- Determing if there's a server running on the local device at the specified port
  $lsof -i :<port>

- Express:
  - Middleware: the format in which the request is received to Express. Express.use() accepts a middleware function to mount. It stores these middleware functions in a stack. Express will use the first middleware function which is able to process the request in the stack.
  - CORS: cross origin resource service is so that other domains can’t use your API endpoints.
  - Express.json(), express.static() (for sending static dirs), and cors().
- API: the application is the backend software. There is an API dir for the web app and it has its endpoints where can either be accessed through the client side buttons which send a request, or manually sending a request ourselves.

More JS in Node context:

- Call back is the same as route handlers and are the function in the perameter of the other funtion.
- Not always async unless attatched with a promise or other callbacks.
- Passed into Node JS's single threded event loop.

Docker: https://docs.docker.com/guides/docker-overview/

- [Dockerfile](https://docs.docker.com/reference/dockerfile/)
- [Docker CLI](https://docs.docker.com/reference/cli/docker/container/cp/)
- Docker Compose is for running the API service and Front end as two separate docker containers with different dependencies.
- [Docker API](https://docs.docker.com/engine/api/sdk/)
- Dokerd: the docker daemon which runs in the background allowing you to pull images.
  - [CLI](https://docs.docker.com/reference/cli/dockerd/)

Google Cloud Storage

- [nodejs reference](https://cloud.google.com/nodejs/docs/reference/storage/latest)

- Object storage (flat key value pairs of buckers with objects inside a bucket)
  / (Global Namespace)
  ├── user1/projectA/bucket1/object1.txt
  ├── user1/projectA/my-bucket/documents/report.pdf
  ├── user1/projectA/my-bucket/videos/lecture.mp4
  ├── user2/projectB/bucket1/photo.jpg
  ├── user2/projectB/bucket2/music.mp3
  ├── user3/projectC/bucket3/data.csv
  └── user3/projectC/bucket4/results.txt

Google Cloud Run

- Deploy docker images as an artifiact registry.
- Also accepts Kubernetes engines for deployment.
- CLI tool uses Python ^11. Gloud init sets up config file (binary path in ~/.zshrc).
- Site URL: https://video-processing-service-5a5gl4o7ga-uc.a.run.app

Google Pub Sub (Message Queue Like Kafka)

- Event driven asynchronous messaging service (push request for our subscription).
- Uses the Post endpoint to process videos.
- Publisher: Creates a topic to provide a message.
- Subscriber: Creates a subscription to recieve a message.
- Fanning out: multiple subscribers for a publisher.
- Fanning in: multiple publishers for a subscriber.
- Many-to-many, and one-to-one (the architecture of our streaming service).

- NextJS
- Three types of pages: API servers (don't need to be in Next APP, we are using firestore functions), Server side (easier on the client browser which needds to use blink and V8 on response), and "use client" which access client side code.
- State in next application. State is usually only managed via API endpoints if it has to be persistent though sessions. This is the same for NextJS but we can use state hooks if we only need the state in this session. (Use state hook to edit state and use effect to trigger use state based on dependencies).

Firebase

- Installing firebase. $npm i firebase firstly downloads firebase to local device from the npm registry before adding to node_modules.
- Firestore (Firebase db)
  - Rules allow you to define the backend (ex. in API endpoints, only allow edits if userID mateched the userID of val in collection).
  - This is why it's called backend as a service (BAAS).
- Firebase Functions (FAAS Function as a Service)
  - Allow you to define your own backend. Simply creating API endpoints for you Firestore db.
  - Server-less DB oftentimes come with BAAS which is backend logic as a service. FAAS is complementary to BAAS, some are specific like firestore functions and some are generally like AWS Lambda or GC functions.
