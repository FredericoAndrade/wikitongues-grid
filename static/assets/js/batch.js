// console.log("hi")
const batch = (max, single) => {
  var Airtable = require('airtable');
  var base = new Airtable({apiKey: process.env.APIKEY}).base(process.env.BASE);
  var payload = []

  base('🍩 Oral Histories').select({
    maxRecords: max,
    view: ".LOCMetadataView",
    cellFormat: "string",
    timeZone: "America/New_York",
    userLocale: "en-ca",
    filterByFormula: single ? "Identifier='"+single+"'" : "",
    // fields: [
    //   // "IDv2",
    //   // "Youtube ID",
    //   // "Title",
    //   "Raw Thumbnail"
    // ]
  }).eachPage(function page(records) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      const test = record.get("Identifier", "Title", "Youtube ID", "Raw Thumbnail")
        // const content = [record.get('IDv2'),record.get('IDv2')]
        // const content = record.fields["Raw Thumbnail"]
        // const id = record.fields["IDv2"]
        // const yt = record.fields["Youtube ID"]
        // const img = record.fields["Raw Thumbnail"]

        // if( img != undefined) {
        // //   console.log(record.fields["IDv2"])
        // //   console.log(record.fields["Youtube ID"])
        //   console.log(img)
        // }
      console.log(test)
      // payload.push(test)
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    // fetchNextPage();

    return payload
  }, function done(err) {
    if (err) { console.error(err); return; }
  });
}
exports.batch = batch
