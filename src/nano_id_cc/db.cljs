(ns nano-id-cc.db
    (:require [reagent.core :as reagent]
              [nano-id-cc.default :as default]))


(defonce app-db
  (reagent/atom { :unit     :hour
                  :speed    1000
                  :length   default/length
                  :alphabet default/alphabet }))


(defn put [key val]
  (swap! app-db assoc key val))