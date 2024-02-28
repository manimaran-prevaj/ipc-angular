if [ $# -eq 0 ]
  then
    echo "No build command. Use: init"
fi

PROJECT_ID=$(cat dist/project-id.txt)
BUILD_TASK=$1


# Should have same keys as angular.json
ANGULAR_CONFIG='ppl-ccc-uat-fe'

#
# Project ID to Anular environment map
#
if [ $PROJECT_ID = "ppl-ccc-uat-fe" ]; then
    ANGULAR_CONFIG='ppl-ccc-uat-fe'
fi

#
# Tasks
#
if [ $BUILD_TASK = "web-en" ]; then
    node_modules/.bin/ng build --delete-output-path=false --aot --configuration=$ANGULAR_CONFIG
fi

if [ $BUILD_TASK = "server-en" ]; then
    node_modules/.bin/ng run pizza-pizza-ccc:server:$ANGULAR_CONFIG
fi

if [ $BUILD_TASK = "ssr-server" ]; then
    node_modules/.bin/ng run pizza-pizza-ccc:server
fi
