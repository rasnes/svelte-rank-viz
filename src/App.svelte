<!-- https://github.com/sveltejs/svelte-virtual-list -->

<script>
	import data from './data.js';
	import { flip } from 'svelte/animate';
	import _ from 'lodash';
	import {
		Card,
    CardText,
    CardSubtitle,
    Row,
    Col,
	} from 'svelte-materialify';
	import { chart } from "svelte-apexcharts";
	import { jStat } from 'jstat';


	let startVal = 80;
	let halfLife = 24;
	const currTime = 18;  
	let tdWeight = 1;
	let ctrWeight = 1;
	let list = data;
	let scores;
	let pH = data[1];
	let plotData;
	let images = data.map(obj => obj.img)
	let options;

	function timeDecay(nv, startVal, halfLife, pHour) {
		const nvScaled = nv/100 * (100 - startVal) + startVal
		const halfLifeScaled = nv/100 * halfLife
		const age = currTime - pHour
		const res =  nvScaled * Math.pow(2,  -age/halfLifeScaled)
		return Math.round(res * 10) / 10
	}

	function getPubTime(pHour) {
		return pHour < 10 ? "0" + pHour + ":00" : pHour + ":00"
	}

	$: {
		list = _.sortBy(data, [obj => -timeDecay(obj.newsValue, startVal, halfLife, obj.publishedHour)])

		scores = data.map(obj => timeDecay(obj.newsValue, startVal, halfLife, obj.publishedHour))

		plotData = data.map((obj, i) => ({name: obj.name, data: [[currTime - obj.publishedHour, scores[i]]]}))

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
				max: 12
			},
			yaxis: {
				tickAmount: 5,
				min: 0,
				max: 100
			},
			markers: {
				size: 20
			},
			fill: {
				type: 'image',
				opacity: 1,
				image: {
					src: images,
					width: 40,
					height: 40
				}
			}
		}
	}


</script>


<Row>
	<Col>
		<div class="d-flex justify-start mt-2 mb-2">
			<div class="rounded elevation-2 pa-2" style="flex-grow:1;max-width:220px;">
				<h4>TimeDecay</h4>
				<br>
				<p><b>Starting value:</b>
					<label>
						<input type=number bind:value={startVal} min=0 max=100>
						<input class="slider" type=range bind:value={startVal} min=0 max=100>
					</label>
					<b>Half life:</b>
					<label>
						<input type=number bind:value={halfLife} min=0 max=100>
						<input class="slider" type=range bind:value={halfLife} min=0 max=100>
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
					<div animate:flip="{{duration: 500}}">
						<Card style="max-height:100px;min-width:300px;">
							<Row>
								<Col cols={8}>
									<div style="margin-left: 10px;">
										<b style="font-size:15px">{article.name}</b> <br>
										<p style="font-size:13px">
											NV: {article.newsValue}, Published: {getPubTime(article.publishedHour)} <br>
											Clicks: {article.clicks}, Imps: {article.impressions} <br>
											TimeDecay: {timeDecay(article.newsValue, startVal, halfLife, article.publishedHour)}
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

<style>
	.slider {
		display: inline-block;
		width: 120px;
		height: 10px;
		padding: 0;
	}
</style>