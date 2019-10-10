(ns nano-id-cc.core
  (:require [nano-id.custom]
            [nano-id-cc.db :as db]
            [nano-id-cc.calc :as calc]
            [nano-id-cc.elements :as elements]
            [nano-id-cc.defaults :as defaults]
            [clojure.string :as string]
            [cljsjs.highlight]
            [cljsjs.highlight.langs.javascript]))


(enable-console-print!)


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


(defn pluralize [n word]
  (if (== n 1) word (str word "s")))


(defn format-time [time]
  (loop [current time
         [{:keys [num ending as-is?]} & rst] units]
    (let [next (/ current num)]
      (cond
        (empty? rst) ending
        (< next 1)   (let [n (Math/round current)]
                       (str "~" n " " (if as-is? ending (pluralize n ending))))
        :else        (recur next rst)))))


(defn result
  [{:keys [alphabet length speed unit]}]
  (let [alphabet    (distinct alphabet)
        speed       (if (= unit "hour") (/ speed 3600) speed)
        random-bits (calc/random-bits (count alphabet) length)
        probability 0.01
        number-ids  (calc/critical-number random-bits probability)
        time        (calc/time-to-collision number-ids speed)]
    (str (format-time time))))


(defn escape [s]
  (string/escape s { \' "\\'"
                     \\ "\\\\" }))


(defn code-sample
  [{:keys [alphabet length]}]
  (let [custom? (not= alphabet defaults/alphabet)
        len     (when (not= length defaults/length) length)
        nano-id (nano-id.custom/generate alphabet)
        id      (nano-id length)]
    (if (not custom?)
      (str "const nanoid = require('nanoid');\n"
           "nanoid(" len "); //=> \"" id "\"")
      (str "const generate = require('nanoid/generate');\n"
           "const alphabet = '" (escape alphabet) "';\n"
           "generate(alphabet, " length "); //=> \"" id "\""))))


(defn highlight-code []
  (let [code (.getElementById js/document "code-sample")]
    (.highlightBlock js/hljs code)))


(defn ^:export init []
  (.addEventListener
    elements/alphabet
    "input"
    #(if (<= (count (.. % -target -value)) 256)
       (db/put :alphabet (.. % -target -value))
       (set! (.. % -target -value) (:alphabet @db/app-db))))

  (.addEventListener
    elements/slider
    "input"
    #(db/put :length (int (.. % -target -value))))

  (.addEventListener
    elements/speed
    "input"
    #(let [val (long (.. % -target -value))]
       (if (or (js/isNaN val)
               (> val  1000000000)
               (< val -1000000000))
         (set! (.. % -target -value) (:speed @db/app-db))
         (db/put :speed val))))

  (.addEventListener
    elements/copy-btn
    "click"
    #(let [range (-> js/document (.createRange))
           selection (-> js/window (.getSelection))]
       (-> range (.selectNodeContents elements/code-sample))
       (-> selection (.removeAllRanges))
       (-> selection (.addRange range))
       (-> js/document (.execCommand "copy"))
       (-> selection (.removeAllRanges))))

  (doseq [button elements/radio-buttons]
    (.addEventListener
      button
      "change"
      #(db/put :unit (.. % -target -value))))

  (add-watch
    db/app-db
    :alphabet
    (fn [key atom old-state new-state]
      (when (not= (:alphabet old-state) (:alphabet new-state))
        (let [alphabet   (:alphabet new-state)
              len        (count alphabet)
              bad?       (or (< len 2)
                             (not (apply distinct? alphabet)))
              class-list (.-classList elements/alphabet)]
          (if bad? (.add    class-list "spoiled")
                   (.remove class-list "spoiled"))
          (set! (.-value elements/alphabet) alphabet)
          (set! (.-textContent elements/counter)
                (str len "/256"))))))

  (add-watch
    db/app-db
    :length
    (fn [key atom old-state new-state]
      (let [length (:length new-state)]
        (when (not= (:length old-state) length)
          (set! (.-value elements/length) length)
          (set! (.-value elements/slider) length)))))

  (add-watch
    db/app-db
    :speed
    (fn [key atom old-state new-state]
      (when (not= (:speed old-state) (:speed new-state))
        (let [speed      (:speed new-state)
              bad?       (< speed 1)
              class-list (.-classList elements/speed)]
          (set! (.-value elements/speed) speed)
          (if bad? (.add    class-list "spoiled")
                   (.remove class-list "spoiled"))))))

  (add-watch
    db/app-db
    :unit
    (fn [key atom old-state new-state]
      (let [unit (:unit new-state)]
        (when (not= (:unit old-state) unit)
          (doseq [button elements/radio-buttons]
            (set! (.-checked button)
                  (= (.-value button) unit)))))))

  (add-watch
    db/app-db
    :result
    (fn [key atom old-state new-state]
      (when (not= old-state new-state))
        (set! (.-textContent elements/result)
              (result new-state))))

  (add-watch
    db/app-db
    :code-sample
    (fn [key atom old-state new-state]
      (when (or (not= (:alphabet old-state) (:alphabet new-state))
                (not= (:length old-state)   (:length new-state)))
        (let [boom? (< (count (:alphabet new-state)) 2)]
          (if boom?
            (set! (.-innerHTML elements/code-sample)
                  "<img class=\"boom\" src=\"boom.jpg\" alt=\"BOOM!!!\">")
            (set! (.-innerHTML elements/code-sample)
                  (code-sample new-state)))
          (highlight-code)))))

  (db/reset)
  (.focus elements/slider))
