<script>
	import { flip } from 'svelte/animate';
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import ListItem from './ListItem.svelte';
	import {
		Card,
    CardText,
    CardSubtitle,
    Row,
    Col,
	} from 'svelte-materialify';
	import articles from './data.js'
	import { each } from 'svelte/internal';

	let startVal = 80;
	let halfLife = 24;
	let start;
	let end;

	function timeDecay(nv, startVal, halfLife, pHour, dayStart = 6) {
		const nvScaled = nv/100 * (100 - startVal) + startVal
		const halfLifeScaled = nv/100 * halfLife
		const age = pHour - dayStart
		const res =  nvScaled * Math.pow(2,  -age/halfLifeScaled)
		return Math.round(res * 10) / 10
	}

	$: articlesRanked = articles.map(
		obj => ({...obj, score: timeDecay(obj.newsValue, startVal, halfLife, obj.publishedHour)})
	)

	$: articlesRanked.sort((a, b) => b.score - a.score)

	function getPubTime(pHour) {
		return pHour < 10 ? "0" + pHour + ":00" : pHour + ":00"
	}

</script>

<!-- <div>
	{#each articlesRanked as a}
		<p>{timeDecay(a.newsValue, startVal, halfLife, a.publishedHour)}</p>
	{/each}
</div> -->

<div class='container'>
	<VirtualList {articlesRanked} bind:start bind:end let:item>
		<ListItem {...item}/>
	</VirtualList>
	<p>showing items {start}-{end}</p>
</div>



<!-- <div class="container">
	<Row class="align-end" noGutters style="height:800px">
		<Col>
			<div class="d-flex justify-start mt-4 mb-4">
				<div class="rounded elevation-2 pa-4" style="flex-grow:1;max-width:400px;">
					<label>
						<input type=number bind:value={startVal} min=0 max=100>
						<input type=range bind:value={startVal} min=0 max=100>
					</label>
					<label>
						<input type=number bind:value={halfLife} min=0 max=100>
						<input type=range bind:value={halfLife} min=0 max=100>
					</label>
				</div>
			</div>
		</Col>
		<Col>
			<div class="d-flex justify-end mt-4 mb-4">
				<div class="rounded elevation-2 pa-4" style="flex-grow:1;max-width:400px;">
					{#each articlesRanked as article (article)}
							<Card>
								<Row>
									<Col cols={8}>
										<CardText>
											<b style="font-size:16px">{article.name}</b> <br>
											NV: {article.newsValue}, Published: {getPubTime(article.publishedHour)} <br>
											Clicks: {article.clicks}, Imps: {article.impressions} <br>
											TimeDecay: {timeDecay(article.newsValue, startVal, halfLife, article.publishedHour)}
										</CardText>
									</Col>
									<Col cols={4}><img src={article.img} alt="cover" /></Col>
								</Row>
							</Card>
						<br />
					{/each}
				</div>
			</div>
		</Col>
	</Row>
</div> -->

<style>
	.container {
		border-top: 1px solid #333;
		border-bottom: 1px solid #333;
		min-height: 200px;
		height: calc(100vh - 15em);
	}
</style>