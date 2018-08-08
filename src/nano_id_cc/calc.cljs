(ns nano-id-cc.calc)


(defn random-bits [alphabet-len id-len]
  (* id-len (/ (Math/log alphabet-len) Math/LN2)))


(defn critical-number [random-bits probability]
  (Math/sqrt (* 2 
                (Math/pow 2 random-bits)
                (Math/log (/ 1 (- 1 probability))))))


(defn time-to-collision [critical-number speed]
  (Math/floor (/ critical-number speed)))

