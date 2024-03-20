#!/bin/bash
###########################################################
# This script is meant to be run inside the Bitbucket
###########################################################

DEPLOYMENT_PROJECT=$(cat dist/project-id.txt)

install_google_cli() {
    SDK_VERSION=380.0.0
    SDK_FILENAME=google-cloud-sdk-${SDK_VERSION}-linux-x86_64.tar.gz
    curl -o /tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/${SDK_FILENAME}
    tar -xvf /tmp/google-cloud-sdk.tar.gz -C /tmp/
    /tmp/google-cloud-sdk/install.sh -q
    source /tmp/google-cloud-sdk/path.bash.inc
    gcloud -v
}

install_google_cli

echo 'GOOGLE CLI instalation complete'

activate_service_account_and_deploy() {
    echo "Activating project: ${DEPLOYMENT_PROJECT}"
    echo $1 | base64 --decode --ignore-garbage > ./gcloud-api-key.json
    gcloud auth activate-service-account --key-file gcloud-api-key.json
    gcloud config set project ${DEPLOYMENT_PROJECT}
}

if [ ${DEPLOYMENT_PROJECT} = "ppl-ccc-uat-fe" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEY_CCC_UAT
fi

# Deploy SDK to bucket
deploy_sdk() {
    # Deploy sdk file to google bucket
    gsutil -h Cache-Control:private cp -a public-read ./dist/build-sdk/pp-sdk-bundle.js gs://${DEPLOYMENT_PROJECT}.appspot.com/js_sdk/pp-sdk-bundle.js

    # Make file publicly available
    gsutil acl ch -u AllUsers:R gs://${DEPLOYMENT_PROJECT}.appspot.com/js_sdk/pp-sdk-bundle.js

    # Get public link
    printf "\n\nDeployed to\n"
    gsutil ls gs://${DEPLOYMENT_PROJECT}.appspot.com/js_sdk/pp-sdk-bundle.js | sed 's/gs:\//https:\/\/storage.googleapis.com/'
}
deploy_sdk

cd dist
# deploy SSR website
gcloud app deploy app.yaml --version=$(cat gae-version.txt) --quiet --no-promote

# deploy mw
cd ../src-web-mw
gcloud app deploy app.yaml --version=$(cat gae-version.txt) --quiet --no-promote
cd ../

# deploy dispatch file
gcloud app deploy dispatch.yaml --quiet --no-promote
