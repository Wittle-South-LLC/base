# base
Base project configured with best practices &amp; tools. To be more specific, is designed to contain:

* Server code providing RESTful APIs written in Python using Flask, SQLAlchemy, and Flask-RESTful
  * Includes requirements.txt file listing needed packages
* Client code for a React-based web application
  * Includes package.json documenting needed packages
  * Includes webpack.config for application structure

Some of the specific capabilities this will demonstrate when fully complete:

* Automatic separation of application into bundles based on routes - Done
* Automatic separation of 3rd party source (from node_modules) into separate bundle - Done
* Dynamic loading of bundles based on route - Done
* Transparet availability of Redux store and dispatch method to components, no HOC desired or required - Done
* Clear comments within webpack configuration explaining the options used and their purpose - Done
* Clear comments in index.jsx explaining how routes are set up and loaded - Done
* Clear comments in Container.jsx explaining how changes in Redux store are made available to child components - Done
* Global menu system that is less intrusive than default Bootstrap examples (invisible when not in use) - Done
* Ability to self-register new users, prevening spammers via Captcha/Recaptcha - Done


