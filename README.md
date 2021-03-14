# svelte-rank-viz

An interactive dashboard app for visualising how ranker parameter settings affect (mock) article rankings. A play project to get some familiarity with Svelte. Check it out on https://rasnes.github.io/svelte-rank-viz/ (ideally on a desktop screen, as getting good responsivity has not been prioritised).

The app could easily be extended to real data, if article meta data, clicks, impressions, etc. is made available through a REST API which could be fetched on page load.

## To run locally

Clone repo and install the dependencies...

```bash
cd svelte-app
npm install
```

...then start Rollup:

```bash
npm run dev
```

Navigate to localhost:5000. You should see your app running. Edit a component file in src, save it, and reload the page to see your changes.

To create an optimised version of the app:

```bash
npm run build
```

## Svelte vs other frameworks

The app is built on top of the https://github.com/sveltejs/template. Svelte was chosen over other frameworks, like React or Vue, mainly because of the shallow learning curve. In review, I must say I like quite much.

I usually make dashboard apps in Shiny (`R`) or Dash (`Python`), and they work well in most cases. In particular, I'd say there are two things in this Svelte app that would be hard to acheive (possible?) in either of those frameworks:

1. The lightning fast reactivity. Since Svelte compiles to optimised vanilla JavaScript all running in the front-end, we get instant reactivity when "turning the knobs".
2. Animations in the ranked article list. Animations make it clearer to the user how exactly "turning the knobs" affect the _rank_ of aricles (not only the ranker _scores_). This could easily be acheived with Svelte's built-in `flip` animation.

## Ranking logic in brief

- `TimeDecay` (`TD`) ranker is simple ranker that makes article ranker scores decay with time since article published (on e.g. a frontpage).
- `CtrScore` (`CS`) ranker is essentially a ranker that takes the number of clicks on an article and divide it with the number of impressions (how many times the article teaser have been exposed). To adjust for small sample sizes, a quantile of the [Beta distribution](https://en.wikipedia.org/wiki/Beta_distribution) is used - the `qbeta probability` parameter can be used to select _which_ quantile of the distribution to be used for ranking. A better illustration of this approach can be seen in this [Shiny dashboard](https://vtr-ranker-qbeta-3jyqrh2z2q-ez.a.run.app/). (A possible improvement could be to include possible [prior](https://en.wikipedia.org/wiki/Conjugate_prior) settings for clicks and impressions.) Finally, to convert the from quantiles to ranker scores, each article get the "percentiles scores", e.g if there are 4 articles to rank, the article with highest CTR would get score 1.0, the second would get 0.75, the third would get 0.5 and the last would get 0.25.
- The combined ranker `Score` is simply the linear combination of (sub)ranker scores times their respective weights: `Score = TD_weight*TD_score + CS_weight*CS_score`.

## Misc

- `flip` animation requires reordering of current JSON object, **not** recreating a new sorted object. (This took me long while to figure out, by trying to copy the approach expemplified here: https://svelte.dev/repl/cd4d1bc127834d11812b1d156a60cdd7?version=3.20.1)
- Build output folder has been changed from `public` to `docs` to make it easy to publish on Github Pages.