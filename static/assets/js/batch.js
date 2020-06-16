const batch = (max, single) => {
  var Airtable = require('airtable');
  var base = new Airtable({apiKey: process.env.APIKEY}).base(process.env.BASE);
  var payload = []

  base('🍩 Oral Histories').select({
    maxRecords: max,
    view: ".LOCMetadataView",
    // cellFormat: "string",
    // timeZone: "America/New_York",
    // userLocale: "en-ca",
    filterByFormula: single ? "IDv2='"+single+"'" : "",
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      const img = record.fields["Raw Thumbnail"]
      const thumbnail = img != undefined ? img[0].thumbnails : undefined ;
      const id = record.fields["IDv2"]
      const yt = record.fields["Youtube ID"]
      const title = record.fields["Title"]
      const test = {id:id,img:thumbnail,yt:yt}
      payload.push(test)
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.

    fetchNextPage();
    console.log(payload)
    return payload
  }, function done(err) {
    if (err) { console.error(err); return; }
  });
}
exports.batch = batch
