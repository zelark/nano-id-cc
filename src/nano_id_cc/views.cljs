(ns nano-id-cc.views
  (:require [nano-id-cc.calc :as calc]
            [nano-id-cc.db :as db]))


(def units [{ :unit 60     :text "seconds" },
            { :unit 60     :text "minutes" },
            { :unit 24     :text "hours" },
            { :unit 365.26 :text "days" },
            { :unit 1000   :text "years" },
            { :unit 1000   :text "thousand years" },
            { :unit 1000   :text "million years" },
            { :unit 1000   :text "billion years" },
            { :unit 1000   :text "trillion years" },
            { :unit 1000   :text "More than 1 quadrillion years" }])


(defn- format-time [time]
  (loop [current time
         [{:keys [unit text]} & rst] units]
    (let [next (/ current unit)]
      (cond
        (empty? rst) text
        (< next 1)   (str "~" (Math/round current) " " text)
        :else        (recur next rst)))))


(defn alphabet []
  (let [val  (:alphabet @db/app-db)
        len  (count val)
        bad? (or (< len 2) (not (apply distinct? val)))]
    [:div  
     [:label { :for :alphabet } "Alphabet:"]
     [:textarea#alphabet
      { :rows        "4"
        :cols        "64"
        :spellCheck  false
        :style       (when bad? {:border-color "#E84855"})
        :value       val
        :on-change   #(when (<= (count (.. % -target -value)) 256)
                        (db/put :alphabet (.. % -target -value))) }]
     [:span#counter len "/256"]]))


(defn id-length []
  (let [length (:length @db/app-db)]
    [:div
     "ID length:"
     [:input#length { :disabled true, :type "number" :value length }]
     "characters"
     [:input#length-slider.slider
      { :min       "2"
        :max       "128"
        :type      :range
        :value     length 
        :on-change #(db/put :length (int (.. % -target -value))) }]]))


(defn radio [key value checked?]
  [:label { :class (when checked? "checked") } (name value)
   [:input
    { :type      :radio
      :name      key
      :value     value
      :checked   checked?
      :on-change #(db/put key value) }]])


(defn speed []
  (let [unit (:unit @db/app-db)
        val  (:speed @db/app-db)
        bad? (< val 1)]
    [:div
     "Speed:"
     [:input#speed 
      { :type      :number
        :value     val
        :style     (when bad? {:border-color "#E84855"})
        :on-change #(db/put :speed (int (.. % -target -value))) }]
     "IDs per "
     [:span.switch
      [radio :unit :hour (= unit :hour)]
      "/"
      [radio :unit :second (= unit :second)]]]))


(defn result []
  (let [{:keys [alphabet length speed unit]} @db/app-db
        speed       (if (= unit :hour) (/ speed 3600) speed)
        random-bits (calc/random-bits (count alphabet) length)
        number-ids  (calc/critical-number random-bits 0.01)
        time        (calc/time-to-collision number-ids speed)]
    [:p
     [:span#result (format-time time)]
     " needed, in order to have a 1% probability of at least one collision."]))


(defn calc []
  [:div
   [:h3 "Calculator"]
   [alphabet]
   [id-length]
   [speed]
   [result]])
