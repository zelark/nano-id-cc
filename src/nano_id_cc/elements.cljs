(ns nano-id-cc.elements)

(def doc js/document)

(def alphabet (.getElementById doc "alphabet"))
(def length   (.getElementById doc "length"))
(def speed    (.getElementById doc "speed"))

(def radio-buttons
  (array-seq (.querySelectorAll doc "input[type=radio]")))

(def slider  (.getElementById doc "length-slider"))
(def counter (.getElementById doc "counter"))

(def result      (.getElementById doc "result"))
(def code-sample (.getElementById doc "code-sample"))
