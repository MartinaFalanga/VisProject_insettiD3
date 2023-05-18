# Insetti d3.js
                                                                             
Crea un file json con dei dati multivariati: ci sono 10 data-point e ogni data-point ha sei variabili quantitative i cui valori sono tutti positivi. In base a questi dati disegna 10 insetti di diversi colori nell'area di disegno (ogni insetto corrisponde ad un data-point). La prima variabile determina la posizione orizzontale dell'insetto, la seconda variabile la sua posizione verticale, la terza variabile la sua lunghezza, la quarta variabile la lunghezza delle zampe, la quinta variabile la grandezza degli occhi, e così via. Facendo click con il pulsante sinistro su un insetto questo rimane evidenziato. Cliccando su un altro insetto, i due insetti selezionati si scambiano il valore di ogni loro variabile (con eccezione delle due variabili che determinano la posizione). Fai in modo che le transizioni avvengano con un'animazione fluida. Usa le scale d3.js per mappare il dominio dei valori delle variabili (che deve essere arbitrario) sul range dei valori delle grandezze geometriche (che dipende dalla larghezza della finestra e dalla metafora di rappresentazione).

### Per la visualizzazione:
-Installare python
-python3 -m http.server 2225
