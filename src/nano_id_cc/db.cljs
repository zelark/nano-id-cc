(ns nano-id-cc.db
    (:require [reagent.core :as reagent]
              [nano-id-cc.defaults :as defaults]))


(defonce app-db
  (reagent/atom { :unit     :hour
                  :speed    1000
                  :length   defaults/length
                  :alphabet defaults/alphabet }))


(defn put [key val]
  (swap! app-db assoc key val))