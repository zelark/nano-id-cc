(ns nano-id-cc.views
  (:require [nano-id.custom]
            [nano-id-cc.db :as db]
            [nano-id-cc.calc :as calc]
            [nano-id-cc.defaults :as defaults]
            [reagent.core :as reagent]
            [cljsjs.highlight]
            [cljsjs.highlight.langs.javascript]))


(def units [{ :num 60      :as-is? false  :ending "second"                        },
            { :num 60      :as-is? false  :ending "minute"                        },
            { :num 24      :as-is? false  :ending "hour"                          },
            { :num 365.26  :as-is? false  :ending "day"                           },
            { :num 1000    :as-is? false  :ending "year"                          },
            { :num 1000    :as-is? true   :ending "thousand years"                },
            { :num 1000    :as-is? true   :ending "million years"                 },
            { :num 1000    :as-is? true   :ending "billion years"                 },
            { :num 1000    :as-is? true   :ending "trillion years"                },
            { :num 1000    :as-is? true   :ending "More than 1 quadrillion years" }])


(defn- pluralize [n word]
  (if (== n 1) word (str word "s")))


(defn- format-time [time]
  (loop [current time
         [{:keys [num ending as-is?]} & rst] units]
    (let [next (/ current num)]
      (cond
        (empty? rst) ending
        (< next 1)   (let [n (Math/round current)]
                       (str "~" n " " (if as-is? ending (pluralize n ending))))
        :else        (recur next rst)))))


(defn alphabet-comp [alphabet]
  (let [len  (count alphabet)
        bad? (or (< len 2) (not (apply distinct? alphabet)))]
    [:div.calc-input
     [:label { :for :alphabet } "Alphabet:"]
     [:textarea#alphabet
      { :rows        "4"
        :cols        "64"
        :spellCheck  false
        :class       (when bad? "spoiled")
        :value       alphabet
        :on-change   #(when (<= (count (.. % -target -value)) 256)
                        (db/put :alphabet (.. % -target -value))) }]
     [:span#counter len "/256"]]))


(defn id-length [length]
  [:div.calc-input
   "ID length:"
   [:input#length { :disabled true, :type "number" :value length }]
   "characters"
   [:input#length-slider.slider
    { :min       "2"
      :max       "128"
      :type      :range
      :value     length
      :on-change #(db/put :length (int (.. % -target -value))) }]])


(defn radio [key value checked?]
  [:label { :class (when checked? "checked") } (name value)
   [:input
    { :type      :radio
      :name      key
      :value     value
      :checked   checked?
      :on-change #(db/put key value) }]])


(defn speed-comp [speed unit]
  (let [bad? (< speed 1)]
    [:div.calc-input
     "Speed:"
     [:input#speed 
      { :type      :number
        :value     speed
        :class     (when bad? "spoiled")
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
     [:span#result [:em (format-time time)]]
     " needed, in order to have a 1% probability of at least one collision."]))


(defn highlight-code [_]
  (let [code (.getElementById js/document "code-sample")]
    (.highlightBlock js/hljs code)))


(defn code-example [alphabet length]
  (reagent/create-class
    {:component-did-update highlight-code
     :component-did-mount  highlight-code
     :reagent-render
     (fn [alphabet length]
       (let [custom? (not= alphabet defaults/alphabet)
             len     (when (not= length defaults/length) length)
             nano-id (nano-id.custom/generate alphabet)
             id      (nano-id length)]
         [:code#code-sample
          (if (not custom?)
            (str "var nanoid = require('nanoid');\n"
                 "nanoid(" len "); //=> \"" id "\"")
            (str "var nanoid = require('nanoid/generate');\n"
                 "var alphabet = '" alphabet "';\n"
                 "generate(alphabet, " length "); //=> \"" id "\""))])) }))


(defn calc []
  (let [{:keys [alphabet length speed unit]} @db/app-db]
    [:div
     [:h2 "Calculator"]
     [alphabet-comp alphabet]
     [id-length length]
     [speed-comp speed unit]
     [result]
     [:h3 "Code sample"]
     [code-example alphabet length]]))
