webchallenge
============

Installation
------------

All the dependencies have been checked into the repo.
This is because npm and bower have had spotty service in
the past. It is also my opinion that they should
be checked in unless you're creating a library :)

Run `npm install` in the project root directory

Configuration
-------------

Configuration is done with the "config.js" file. Follow the example of
"config.js.example"

Starting the Development Server
------------------------------

run `grunt server` to run a development server with livereload. A
livereload plugin is needed to use this feature.

Alternatively, the server can be run with `node server.js dev` or just `node server.js`

Starting a Production Server
----------------------------

Be sure the project is built with `grunt build`. Start the server
either by running `node server.js prod` or wiring
it up to a real server like nginx. `server.js` can run standalone.

