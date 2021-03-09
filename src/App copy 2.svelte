<!-- https://github.com/sveltejs/svelte-virtual-list -->

<script>
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import articles from './data.js';
	import ListItem from './ListItem.svelte';
	import { flip } from 'svelte/animate';
	import _ from 'lodash';
	
	let startVal = 80;
	let halfLife = 24;
	let start;
	let end;
	let items;
	let scores;
	let groups;

	function timeDecay(nv, startVal, halfLife, pHour, dayStart = 6) {
		const nvScaled = nv/100 * (100 - startVal) + startVal
		const halfLifeScaled = nv/100 * halfLife
		const age = pHour - dayStart
		const res =  nvScaled * Math.pow(2,  -age/halfLifeScaled)
		return Math.round(res * 10) / 10
	}

	$: {
		scores = articles.map(obj => timeDecay(obj.newsValue, startVal, halfLife, obj.publishedHour))
		console.log(scores)

		groups = _.groupBy(scores, 1);
		console.log(groups)
		items = _.map(articles, function (i) { return groups[i].shift(); });

		// items = articles.sort((a, b) => scores.indexOf(a) - scores.indexOf(b))
		console.log(items)
	}

	function getPubTime(pHour) {
		return pHour < 10 ? "0" + pHour + ":00" : pHour + ":00"
	}
</script>

<h1>Virtual list</h1>
<p>Instead of rendering all your data, &lt;VirtualList&gt; just renders the bits that are visible, keeping your page nice and light.</p>
<p>The source code for the component is <a href='https://github.com/sveltejs/svelte-virtual-list'>here</a>.</p>

<div class='container'>
	<VirtualList {items} bind:start bind:end let:item>
		<ListItem {...item}/>
	</VirtualList>
	<p>showing items {start}-{end}</p>
</div>
<br>

<br>
<label>
	<input type=number bind:value={startVal} min=0 max=100>
	<input type=range bind:value={startVal} min=0 max=100>
</label>
<label>
	<input type=number bind:value={halfLife} min=0 max=100>
	<input type=range bind:value={halfLife} min=0 max=100>
</label>

<style>
	.container {
		border-top: 1px solid #333;
		border-bottom: 1px solid #333;
		min-height: 200px;
		height: calc(100vh - 15em);
	}
</style>