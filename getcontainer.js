var soap = require('soap');
// At the bottom of the wsdl file you will find the http address of the service
var prodURL = '/plex-pro.wsdl';
var testURL = '/plex-test.wsdl';
// https://developers.redhat.com/blog/2016/02/19/apps-101-an-absolute-beginners-guide-to-integrating-with-a-node-js-backend/
//API Blueprint
var request_data = {
  ExecuteDataSourceRequest: {
    DataSourceKey: '10837',
    InputParameters: {
      InputParameter: {
        Name: 'Serial_No',
        Value: 'BV066378',
        Required: 'true',
        Output: 'false',
      },
    },
  },
};
var args = {name: 'value'};
var plexWSDL = __dirname + prodURL;
//var plexWSDL = __dirname + testURL;

soap.createClient(plexWSDL, function(err, client) {
  debugger;
  // we now have a soapClient - we also need to make sure there's no `err` here.
  if (err) {
    return res.status(500).json(err);
  }
  debugger;
  client.setSecurity(
    new soap.BasicAuthSecurity('BuscheAvillaKorsws@plex.com', '5b11b45-f59f-'),
  );
  debugger;
  client.ExecuteDataSource(request_data, function(err, result) {
    // we now have a soapClient - we also need to make sure there's no `err` here.
    if (err) {
      return res.status(500).json(err);
    }

    console.log(
      result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0].Columns.Column[14]
    );
    debugger;
    // console.log(
    //   result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0].Columns
    //     .Column[0].Name,
    // );
    // var res =
    //   result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0].Columns
    //     .Column;
    // console.log(res[0].Name);
    // for (var i = 0; i < res.length; i++) {
    //   console.log(res[i].Name + res[i].Value);
    // }
  });
});
