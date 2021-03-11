let images = [
  {
    name: 'Getting married',
    newsValue: 10,
  },
  {
    name: 'Champs won easily',
    newsValue: 25,
  },
  {
    name: 'More snow to come',
    publishedHour: 11,
    newsValue: 14
  },
  {
    name: "X's vaccine approved",
    newsValue: 16
  },
  {
    name: 'Sings like a larch',
    newsValue: 20
  },
  {
    name: 'Gain 20 in 7 days',
    newsValue: 60
  },
  {
    name: 'How to lose weight',
    newsValue: 30
  },
  {
    name: 'Tom earned 20 quid',
    newsValue: 35
  },
  {
    name: 'Reds get closer to top',
    newsValue: 50
  },
  {
    name: 'No closer to agreement',
    newsValue: 60
  },
  {
    name: 'Earthquake in two days',
    newsValue: 20
  },
  {
    name: 'The stocks to buy now',
    newsValue: 40
  },
];

const highClicks = 500;
const highImps = 5000;
const lowClicks = highClicks/20;
const lowImps = highImps/30;

const generateEvents = e => Math.round(Math.random() * e)

function createClicks(i) {
  return (i%3 === 0 ? generateEvents(lowClicks) : generateEvents(highClicks))
}

function createImps(i) {
  return (i%3 === 0 ? lowClicks + generateEvents(lowImps) : highClicks*2 + generateEvents(highImps))
}

let data = images.map(
  (obj, i) => ({
    ...obj,
    id: i,
    publishedHour: i + 7,
    img: "//picsum.photos/80?random=" + i,
    clicks: createClicks(i),
    impressions: createImps(i)
  })
)

export default data;