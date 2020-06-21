const batch = (max, single) => {
  var Airtable = require('airtable');
  var base = new Airtable({apiKey: process.env.APIKEY}).base(process.env.BASE);
  var payload = [];
  var fs = require('fs');


  base('🍩 Oral Histories').select({
    maxRecords: max,
    view: "GridAppView",
    sort: [{field: "Youtube Publish Date", direction: "desc"}],
    // cellFormat: "string",
    // timeZone: "America/New_York",
    // userLocale: "en-ca",
    filterByFormula: single ? "IDv2='"+single+"'" : "",
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      const img = record.fields["Raw Thumbnail"]
      const thumbnail = img != undefined ? img[0].thumbnails : img ;
      const thumbnail_url = thumbnail != undefined ? thumbnail.large.url : thumbnail ;
      const id = record.fields["Identifier"];
      const yt = record.fields["Youtube ID"];
      const title = record.fields["Title"];
      // const description = record.fields["Description"];
      const object = {id:id,title:title,youtube:yt,img:thumbnail_url};
      payload.push(object)
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.

    fetchNextPage();

    let data = JSON.stringify(payload);
    fs.writeFileSync("static/assets/js/data.json", data, function (err) {
      if (err) return console.log(err);
    })

    return payload

  }, function done(err) {
    if (err) { console.error(err); return; }
  });
}
exports.batch = batch
