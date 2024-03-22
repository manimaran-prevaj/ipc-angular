# PizzaPizzaCcc
This is front end for PizzaPizza CCC.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

## Prerequisites
-	NodeJs ^20.9.0 with npm/nvm
-	Angular CLI ^17.2.0
-	Visual Studio Code with following plugins:
	-	Code spell checker
	-	Debugger for Chrome
	-	ESLint
	-	HTMLHint
	-	IntelliSense for css
	-	Sass lint
	-	TabSpacer

## Used technologies
-	Angular Cli 17.2.0
-	Angular SSR 
-	Node JS 20.9.0
-	Package manager NPM 10.1.0
-	TypeScript 5.2.2
-	RxJS 7.8.0
-	Google Material Design
-	SCSS

## Getting Started / Installing
-	Clone github repository from [BitBucket](https://bitbucket.org/pizzapizzateam/ppl-ccc-fe-phx2/src/ccc-uat/).
-	Install dependencies via npm install.
-	Start the middleware
-	Start the development server.

## Middleware
-	`npm run middleware` to start the middleware.

## Development server
-	npm run start / ng serve to start development server
-	Navigate to `http://localhost:4200/`.
-	The application will automatically reload if you change any of the source files.

## Code scaffolding
-	Run `ng generate component component-name` to generate a new component.
-	You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Code conversion
-	Use ONLY tabs in all source files
-	For every component which has multiple states use Enums. Don't hardcode any value
-	Application consist of components and containers. All components needs to be stateless.
-	All styling/scss need to be isolated withing the component

### Linting
-	Run `npm run lint` to execute the linting.
-	Before committing the code make sure that all linting issue are fixed in *.ts, *.scss *.html .
-	Use proper type checking while defining variable, function arguements, etc. Use type unknow if the type is 
	not know instaed of any as it more type safe. Only disable linting rules using inline commands if the type is
	generic.
-	Continuous integration server will check every commit and notify bitbucket status.

## Build
-	Run `npm run build: dev/prod/uat` to build the project.
-	Run `npm run build: ssr` to build the server side rendering project.
-	you need to build ahead of time compilation build for production build.
-	The build artifacts will be stored in the `dist/` directory.

## Deployment
-	Project is deployed via Bitbucket Pipelines using TAGS.
-	Use the following tag structure to deploy to the correct environment `release-ENV-YYYYMMDDTIME (TIME in 24hr format)`:
	-	release-dev-201905011345
	-	release-qa-201905011345
	-	release-uat-201905011345

-	Tags should ONLY be created/pushed from the Development branch
	-	Examples of git commands to create/push tags `git tag release-dev-201905091200` then `git push origin --tags`

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
