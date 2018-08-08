(ns nano-id-cc.db
    (:require [reagent.core :as reagent]))


(def ^:const alphabet
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~")


(defonce app-db 
  (reagent/atom { :unit     :hour
                  :speed    1000
                  :length   21
                  :alphabet alphabet }))


(defn put [key val]
  (swap! app-db assoc key val))