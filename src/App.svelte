<!-- https://github.com/sveltejs/svelte-virtual-list -->

<script>
	import data from './data.js';
	import { flip } from 'svelte/animate';
	import _ from 'lodash';
	import {
		Card,
    Row,
    Col,
	} from 'svelte-materialify';
	import { chart } from 'svelte-apexcharts';
	import { jStat } from 'jstat';


	let startVal = 80;
	let halfLife = 24;
	let ctrProb = 0.1;
	const currTime = 18;  
	let tdWeight = 1;
	let ctrWeight = 1;
	let list = data;
	let scores;
	let pH = data[1];
	let plotData;
	const images = data.map(obj => obj.img)
	let options;
	let rankedIds;
	let ctrRank;
	let ctrRankedIds;
	let ctrRankedScores;
	let ctrPercentile;
	let listRankedIds;

	let percentiles = jStat.seq(0, 1, data.length + 1).reverse()

	function timeDecay(nv, startVal, halfLife, pHour) {
		const nvScaled = nv/100 * (100 - startVal) + startVal
		const halfLifeScaled = nv/100 * halfLife
		const age = currTime - pHour
		const res =  nvScaled * Math.pow(2,  -age/halfLifeScaled)
		return res/100
	}

	function getPubTime(pHour) {
		return pHour < 10 ? "0" + pHour + ":00" : pHour + ":00"
	}

	function ctrScore(prob, clicks, imps) {
		return Math.round(jStat.beta.inv(prob, clicks, imps - clicks) * 10000) / 10000
	}

	function rankerScore(w1, w2, startVal, halfLife, nv, pHour, percentile) {
		let score = w1*timeDecay(nv, startVal, halfLife, pHour) + w2*percentile
		return Math.round(score * 100) / 100
	}

	$: {

		ctrRank = _.sortBy(data, [o => -ctrScore(ctrProb, o.clicks, o.impressions)])
	  ctrRankedIds = ctrRank.map(o => o.id)
		ctrRankedScores = ctrRank.map((o, i) => percentiles[i])
		ctrPercentile = _.zipObject(ctrRankedIds, ctrRankedScores)

		list = _.sortBy(data, [o => -rankerScore(tdWeight, ctrWeight, startVal, halfLife, o.newsValue, o.publishedHour, ctrPercentile[o.id])])
		listRankedIds = list.map(o => o.id)

		scores = data.map(o => rankerScore(tdWeight, ctrWeight, startVal, halfLife, o.newsValue, o.publishedHour, ctrPercentile[o.id]))

		plotData = data.map((o, i) => ({name: o.name, data: [[currTime - o.publishedHour, scores[i]]]}))

		options = {
			series: plotData,
			chart: {
				type: 'scatter',
				// height: 600,
				width: '200%',
				animations: {
					enabled: false
				},
				zoom: {
					enabled: false,
					axis: "xy"
				},
				toolbar: {
					show: false
				}
			},
			xaxis: {
				tickAmount: 2,
				min: 0,
				max: 12,
				title: {
					text: "Hours since published"
				}
			},
			yaxis: {
				// tickAmount: 0.05,
				min: 0,
				max: 2,
				title: {
					text: "Combined ranker scores (Score)"
				}
			},
			legend: {
				show: false
			},
			markers: {
				size: 25
			},
			fill: {
				type: 'image',
				opacity: 1,
				image: {
					src: images,
					width: 50,
					height: 50
				}
			}
		}
	}


</script>

<main>
	<Row>
		<Col>
			<div class="d-flex justify-start mt-2 mb-2">
				<div class="rounded elevation-2 pa-2" style="flex-grow:1;max-width:220px;">
					<h4>TimeDecay</h4>
					<br>
					<p>
						<b>Weight:</b>
						<label>
							<input type=number bind:value={tdWeight} min=0 max=2 step=0.1>
							<input class="slider" type=range bind:value={tdWeight} min=0 max=2 step=0.1>
						</label>
						<b>Starting value:</b>
						<label>
							<input type=number bind:value={startVal} min=0 max=100 step=1>
							<input class="slider" type=range bind:value={startVal} min=0 max=100 step=5>
						</label>
						<b>Half life:</b>
						<label>
							<input type=number bind:value={halfLife} min=0 max=100 step=1>
							<input class="slider" type=range bind:value={halfLife} min=0 max=100 step=5>
						</label>
					</p>
					<h4>CtrScore</h4>
					<br>
					<p>
						<b>Weight:</b>
						<label>
							<input type=number bind:value={ctrWeight} min=0 max=2 step=0.1>
							<input class="slider" type=range bind:value={ctrWeight} min=0 max=2 step=0.1>
						</label>
						<b><code>qbeta</code> probability:</b>
						<label>
							<input type=number bind:value={ctrProb} min=0.01 max=0.99 step=0.01>
							<input class="slider" type=range bind:value={ctrProb} min=0.01 max=0.99 step=0.01>
						</label>
					</p>
				</div>
			</div>
		</Col>
		<Col>
			<div class="d-flex mt-2 mb-2">
				<div class="rounded elevation-2 pa-6" style="flex-grow:1;">
					<div use:chart={options} />
				</div>
			</div>
		</Col>
		<Col>
			<div class="d-flex justify-end mt-2 mb-2">
				<div class="rounded elevation-2 pa-3" style="flex-grow:1;max-width:330px;overflow:auto;max-height:800px;">
					{#each list as article (article)}
						<div animate:flip="{{duration: 500, delay: 150}}">
							<Card style="max-height:100px;min-width:310px;">
								<Row>
									<Col cols={8}>
										<div style="margin-left: 10px;">
											<b style="font-size:14px">{listRankedIds.indexOf(article.id) + 1}: {article.name}</b> <br>
											<p style="font-size:12px">
												NV: {article.newsValue}, Published: {getPubTime(article.publishedHour)} <br>
												Clicks: {article.clicks}, Imps: {article.impressions}, CTR: {Math.round(ctrScore(ctrProb, article.clicks, article.impressions) * 100) / 100} <br>
												TD: {Math.round(timeDecay(article.newsValue, startVal, halfLife, article.publishedHour) * 100) / 100},
												CS: {Math.round(ctrPercentile[article.id] * 100) / 100}, 
												Score: {rankerScore(
													tdWeight, ctrWeight, startVal, halfLife, article.newsValue, article.publishedHour, ctrPercentile[article.id]
												)}
											</p>
										</div>
									</Col>
									<Col cols={4}><img src={article.img} alt="cover" /></Col>
								</Row>
							</Card>
						<br />
						</div>
					{/each}
				</div>
			</div>
		</Col>
	</Row>
</main>

<style>
	.slider {
		display: inline-block;
		width: 110px;
		height: 10px;
		padding: 0;
	}
</style>