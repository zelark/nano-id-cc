(defproject nano-id-cc "0.1.0"
  :description "NanoID Collision Calculator"
  :url "https://github.com/zelark/nano-id-cc"
  :license {:name "The MIT License"
            :url  "https://opensource.org/licenses/MIT"}

    
  :min-lein-version "2.7.1"


  :dependencies [[org.clojure/clojure       "1.9.0"]
                 [org.clojure/clojurescript "1.10.439"]
                 [cljsjs/highlight          "9.12.0-2"]
                 [nano-id                   "0.9.3"]]


  :plugins [[lein-figwheel       "0.5.16"]
            [lein-cljsbuild      "1.1.7" :exclusions [[org.clojure/clojure]]]
            [lein-asset-minifier "0.4.4" :exclusions [[org.clojure/clojure]]]]


  :minify-assets [[:css {:source "resources/public/css/style.css"
                         :target "resources/public/css/style.min.css"}]]


  :aliases {"build" ["do" ["clean"]
                          ["minify-assets"]
                          ["cljsbuild" "once" "min"]]}


  :source-paths ["src"]


  :cljsbuild {:builds
              [{:id "dev"
                :source-paths ["src"]
                :figwheel {:open-urls ["http://localhost:3449/index.html"]}

                :compiler {:main nano-id-cc.core
                           :asset-path "js/compiled/out"
                           :output-to "resources/public/js/compiled/nano_id_cc.js"
                           :output-dir "resources/public/js/compiled/out"
                           :source-map-timestamp true
                           :preloads [devtools.preload]}}
               {:id "min"
                :source-paths ["src"]
                :compiler {:output-to "resources/public/js/compiled/nano_id_cc.js"
                           :main nano-id-cc.core
                           :optimizations :advanced
                           :pretty-print false}}]}


  :figwheel {:css-dirs ["resources/public/css"]}


  :profiles {:dev {:dependencies [[binaryage/devtools "0.9.9"]
                                  [figwheel-sidecar "0.5.16"]
                                  [cider/piggieback "0.3.1"]]
                   :source-paths ["src" "dev"]
                   :repl-options {:nrepl-middleware [cider.piggieback/wrap-cljs-repl]}
                   :clean-targets ^{:protect false} ["resources/public/js/compiled"
                                                     "resources/public/css/style.min.css"
                                                     :target-path]}})
