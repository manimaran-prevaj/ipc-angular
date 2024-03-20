if [ $# -eq 0 ]
  then
    echo "No build command. Use: init"
fi

PROJECT_ID=$(cat dist/project-id.txt)
BUILD_TASK=$1

# Building JS SDK
build_sdk() {
   # Clear distribution folders
   rm -rf dist/build-sdk
   mkdir dist/build-sdk

   # Install packages and build
   cd src-sdk
   npm i
   npm run build

   # Copy build to distribution folder
   cp ./dist/pp-sdk-bundle.js ./../dist/build-sdk/pp-sdk-bundle.js
   cd ../
}


# Should have same keys as angular.json
ANGULAR_CONFIG='ppl-ccc-uat-fe'

#
# Project ID to Angular environment map
#
if [ $PROJECT_ID = "ppl-ccc-uat-fe" ]; then
    ANGULAR_CONFIG='ppl-ccc-uat-fe'
fi

#
# Tasks
#
if [ $BUILD_TASK = "sdk" ]; then
    build_sdk
fi

if [ $BUILD_TASK = "web-en" ]; then
    node_modules/.bin/ng build --delete-output-path=false --aot --configuration=$ANGULAR_CONFIG
fi

if [ $BUILD_TASK = "server-en" ]; then
    node_modules/.bin/ng run pizza-pizza-ccc:server:$ANGULAR_CONFIG
fi
