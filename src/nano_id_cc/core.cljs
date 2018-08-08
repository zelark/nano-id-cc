(ns nano-id-cc.core
    (:require [reagent.core :as reagent]
              [nano-id-cc.views :as views]))


(enable-console-print!)


(defn on-js-reload []
  (reagent/render-component [views/calc]
                            (.getElementById js/document "calc")))


(defn ^:export init []
  (on-js-reload))