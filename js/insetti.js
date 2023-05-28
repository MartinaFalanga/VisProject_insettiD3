d3.json("data/data.json").then(data => {
	const width = 800;
	const height = 600;

	// Domini e range per ciascuna variabile
	const xDomain = [0, 300];
	const yDomain = [0, 300];
	const lunghezzaDomain = [35, 80];
	const lunghezzaZampeDomain = [10, 28];
	const grandezzaOcchiDomain = [3, 12];
	const grandezzaAliDomain = [8, 22];

	const xRange = [0, width];
	const yRange = [0, height];
	const lunghezzaRange = [10, 100];
	const lunghezzaZampeRange = [5, 50];
	const grandezzaOcchiRange = [1, 15];
	const grandezzaAliRange = [5, 30];

	// Scale D3.js
	const scaleX = d3.scaleLinear().domain(xDomain).range(xRange);
	const scaleY = d3.scaleLinear().domain(yDomain).range(yRange);
	const scaleLunghezza = d3.scaleLinear().domain(lunghezzaDomain).range(lunghezzaRange);
	const scaleLunghezzaZampe = d3.scaleLinear().domain(lunghezzaZampeDomain).range(lunghezzaZampeRange);
	const scaleGrandezzaOcchi = d3.scaleLinear().domain(grandezzaOcchiDomain).range(grandezzaOcchiRange);
	const scaleGrandezzaAli = d3.scaleLinear().domain(grandezzaAliDomain).range(grandezzaAliRange);

	const svg = d3.select("body")
		.append("svg")
		.attr("width", width)
		.attr("height", height);


	let selectedInsetto = null;


	function selectInsetto(insetto, d) {
		if (selectedInsetto === null) {
			selectedInsetto = { insetto, data: d };
			insetto.classed("selected", true);
		} else {
			if (selectedInsetto.insetto.node() === insetto.node()) {
				// Deseleziono l'insetto corrente
				selectedInsetto.insetto.classed("selected", false);
				selectedInsetto = null;
			} else {
				// Inizializza la transizione
				const t = d3.transition().duration(1000);

				// Applica la transizione agli attributi degli insetti
				selectedInsetto.insetto.transition(t)
					.tween("attr", () => {
						// Interpolazioni per le variabili degli insetti
						const lunghezzaInterpolate = d3.interpolate(selectedInsetto.data.lunghezza, d.lunghezza);
						const lunghezzaZampeInterpolate = d3.interpolate(selectedInsetto.data.lunghezza_zampe, d.lunghezza_zampe);
						const grandezzaOcchiInterpolate = d3.interpolate(selectedInsetto.data.grandezza_occhi, d.grandezza_occhi);
						const grandezzaAliInterpolate = d3.interpolate(selectedInsetto.data.grandezza_ali, d.grandezza_ali);

						return (t) => {
							// Scambia le variabili tranne la posizione
							selectedInsetto.data.lunghezza = lunghezzaInterpolate(t);
							selectedInsetto.data.lunghezza_zampe = lunghezzaZampeInterpolate(t);
							selectedInsetto.data.grandezza_occhi = grandezzaOcchiInterpolate(t);
							selectedInsetto.data.grandezza_ali = grandezzaAliInterpolate(t);

							// Aggiorna la visualizzazione dell'insetto
							selectedInsetto.insetto.selectAll("*").remove();
							drawInsetto(selectedInsetto.data, selectedInsetto.insetto);
						};
					});

				insetto.transition(t)
					.tween("attr", () => {
						// Interpolazioni per le variabili degli insetti
						const lunghezzaInterpolate = d3.interpolate(d.lunghezza, selectedInsetto.data.lunghezza);
						const lunghezzaZampeInterpolate = d3.interpolate(d.lunghezza_zampe, selectedInsetto.data.lunghezza_zampe);
						const grandezzaOcchiInterpolate = d3.interpolate(d.grandezza_occhi, selectedInsetto.data.grandezza_occhi);
						const grandezzaAliInterpolate = d3.interpolate(d.grandezza_ali, selectedInsetto.data.grandezza_ali);

						return (t) => {
							// Scambia le variabili tranne la posizione
							d.lunghezza = lunghezzaInterpolate(t);
							d.lunghezza_zampe = lunghezzaZampeInterpolate(t);
							d.grandezza_occhi = grandezzaOcchiInterpolate(t);
							d.grandezza_ali = grandezzaAliInterpolate(t);

							// Aggiorna la visualizzazione dell'insetto
							insetto.selectAll("*").remove();
							drawInsetto(d, insetto);
						};
					})
					.on("end", () => {
						// Deseleziona l'insetto precedente
						selectedInsetto.insetto.classed("selected", false);
						selectedInsetto = null;
					});
			}
		}
	}


	   
	 function drawInsetto(d, target = null) {
		 const insetto = target || svg.append("g");
		 insetto.attr("transform", `translate(${scaleX(d.x)}, ${scaleY(d.y)})`);
		 insetto.selectAll("*").remove();

			 // Disegno il corpo dell'insetto
			 insetto.append("ellipse")
					.attr("cx", scaleLunghezza(d.lunghezza) / 2)
					.attr("cy", scaleLunghezzaZampe(d.lunghezza_zampe) / 4)
					.attr("rx", scaleLunghezza(d.lunghezza) / 2)
					.attr("ry", scaleLunghezzaZampe(d.lunghezza_zampe) / 4)
					.attr("fill", d3.interpolateRainbow(data.data.indexOf(d) / data.data.length));

			 // Disegno 2 zampe
			 const posizioniZampe = [
					{ x: scaleLunghezza(d.lunghezza) / 3, y: scaleLunghezzaZampe(d.lunghezza_zampe) / 4 },
					{ x: scaleLunghezza(d.lunghezza) * 2 / 3, y: scaleLunghezzaZampe(d.lunghezza_zampe) / 4 },
			];

			 posizioniZampe.forEach(posizione => {
					 insetto.append("line")
					   .attr("x1", posizione.x)
					   .attr("y1", posizione.y)
					   .attr("x2", posizione.x)
					   .attr("y2", posizione.y + scaleLunghezzaZampe(d.lunghezza_zampe) / 2)
					   .attr("stroke", "black")
					   .attr("stroke-width", 1);
			});

			 // Disegno un occhio
			 const occhio = insetto.append("circle")
					.attr("cx", scaleLunghezza(d.lunghezza))
					.attr("cy", scaleLunghezzaZampe(d.lunghezza_zampe) / 4 -3)
					.attr("r", scaleGrandezzaOcchi(d.grandezza_occhi))
					.attr("fill", "black");

			 // Disegno 2 ali
			 const alaSx = insetto.append("ellipse")
					.attr("cx", scaleLunghezza(d.lunghezza) / 2 - scaleGrandezzaAli(d.grandezza_ali) / 4)
					.attr("cy", -3)
					.attr("rx", scaleGrandezzaAli(d.grandezza_ali) / 4)
					.attr("ry", scaleGrandezzaAli(d.grandezza_ali) / 2)
					.attr("fill", "rgba(0, 0, 0, 0.2)");

			 const alaDx = insetto.append("ellipse")
					.attr("cx", scaleLunghezza(d.lunghezza) / 2 + scaleGrandezzaAli(d.grandezza_ali) / 4)
					.attr("cy", -3)
					.attr("rx", scaleGrandezzaAli(d.grandezza_ali) / 4)
					.attr("ry", scaleGrandezzaAli(d.grandezza_ali) / 2)
					.attr("fill", "rgba(0, 0, 0, 0.2)");


			insetto.on("click", () => selectInsetto(insetto, d));
	}


	data.data.forEach(d => {
			const insettoGroup = svg.append("g");
			drawInsetto(d, insettoGroup);
	});


});
