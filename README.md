# NanoID Collision Calculator

NanoID is a library for generating random IDs. Likewise UUID there is a probability that an ID will be duplicated. But this probability is extremely small.

Meanwhile there are many projects that generates IDs in small numbers. For those projects the ID length could be reduced without risk.

The aim of this calculator is to help you realize the extent to which the ID length can be reduced.

## Setup

To get an interactive development environment run:

    lein figwheel

It will open your browser at [localhost:3449/index.html](http://localhost:3449/index.html).
This will auto compile and send all changes to the browser without the
need to reload.

To clean all compiled files:

    lein clean

To create a production build run:

    lein do clean, cljsbuild once min

