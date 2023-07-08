# Tatamo/social
This project was bootstrapped with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli).

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Deploy to Cloud Run
```
PROJECT=<your-google-cloud-project-id>
REGION=asia-northeast1
REPOSITORY=tatamo-social
IMAGE=tatamo-social
IMAGE_URL=$REGION-docker.pkg.dev/$PROJECT/$REPOSITORY/${IMAGE}:latest
CLOUD_RUN_SERVICE=tatamo-social

# initial setup (first time only)
gcloud artifacts repositories create $REPOSITORY --location $REGION --repository-format docker --project $PROJECT
gcloud auth configure-docker $REGION-docker.pkg.dev

# push image and deploy
docker build -t $IMAGE_URL .
docker push $IMAGE_URL
gcloud run deploy $CLOUD_RUN_SERVICE --image $IMAGE_URL --port 3000 --allow-unauthenticated --region $REGION --project $PROJECT
```
