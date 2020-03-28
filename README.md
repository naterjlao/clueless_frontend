## Clueless Front-End Component

## About
This is an implementation of the game [Clue-Less](Clue-Less/Clue-Less.pdf)
The project is built and run using the Angular framework with Node.js. Packages are installed and managed with npm. Functionality, interactivity, and game logic are written with TypeScript, the displayed content is written in HTML, and the styles are written using Less. Unit Tests are performed with the spec.ts files for each module, run using the Jasmine JavaScript test framework through the Karma test runner, when executing the ```ng test``` command.

## Setup
1. Ensure you have installed node and npm in your system. You can check with the following commands:
```node.js
node --version
npm --version
```

2. Install Angular CLI:
```node.js
npm install -g @angular/cli
```

3. If pulling an existing Angular project, run ```npm install``` to install all dependencies. (Note: project will not build or run if this step is skipped)

4. Run the application
```cd``` to the workspace folder with the app and run it with:
```node.js
ng serve -o
```
*The ```ng serve``` command launches the server, watches your files, and rebuilds the app as you make changes to those files.*
*The ```-o``` option automatically opens your browser to ```http://localhost:4200/```.*
*To serve on a specific NUMBER port, use*
```node.js
ng serve --port NUMBER
```

### References
Angular: https://angular.io/
Node.js: https://nodejs.org/en/docs/
npm: https://docs.npmjs.com/
TypeScript: https://www.typescriptlang.org/docs/home.html
HTML: https://www.w3schools.com/TAGS/default.ASP
Less: http://lesscss.org/