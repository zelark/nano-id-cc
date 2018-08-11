(ns nano-id-cc.db
    (:require [nano-id-cc.defaults :as defaults]))


(defonce app-db (atom {}))


(defn reset []
  (reset! app-db { :unit     "hour"
                   :speed    1000
                   :length   defaults/length
                   :alphabet defaults/alphabet }))


(defn put [key val]
  (swap! app-db assoc key val))