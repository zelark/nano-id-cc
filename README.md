# Nano ID Collision Calculator

[Nano ID](https://github.com/ai/nanoid) is a library for generating random IDs. Likewise UUID, there is a probability of duplicate IDs. However, this probability is extremely small.

Meanwhile, a lot of projects generate IDs in small numbers. For those projects, the ID length could be reduced without risk.

This [calculator](https://zelark.github.io/nano-id-cc/) aims to help you realize the extent to which the ID length can be reduced.

## Setup
First, you need to have [Leiningen](https://leiningen.org/) installed.

To minify CSS run:

    lein minify-assets

To get an interactive development environment run:

    lein figwheel

It will open your browser at [localhost:3449/index.html](http://localhost:3449/index.html).
This will auto compile and send all changes to the browser without the
need to reload.

To clean all compiled files:

    lein clean

To create a production build run:

    lein build

## Acknowledgments

First of all, I would like to thank [Andrey Sitnik](https://github.com/ai) — he is a role model for other developers to look up to (but drinking). Second, thank [Alexey Komarov](https://github.com/alex7kom) — its version of the calculator pushed me to make my own one. And my special thanks to [Artem Alalykin](https://github.com/ArtyomAN) who helped me with the math.

Also, thanks to all guys who helped me to review the interface.
