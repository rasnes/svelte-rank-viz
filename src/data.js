
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
    name: 'Tom gained 20 pounds',
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
];

let data = images.map(
  (obj, i) => ({
    ...obj,
    id: i,
    publishedHour: i + 8,
    img: "//picsum.photos/80?random=" + i,
    clicks: Math.round(Math.random() * 1000),
    impressions: Math.round(Math.random() * 50000)
  })
)

export default data;