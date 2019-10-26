var soap = require('soap');
var url = 'https://api.plexonline.com/DataSource/Service.asmx?WSDL';
// https://developers.redhat.com/blog/2016/02/19/apps-101-an-absolute-beginners-guide-to-integrating-with-a-node-js-backend/
//API Blueprint
var request_data = {
  ExecuteDataSourceRequest: {
    DataSourceKey: '2272',
    InputParameters: {
      InputParameter: {
        Name: 'Workcenter_Key',
        Value: '61324',
        Required: 'false',
        Output: 'false',
      },
    },
  },
};
var args = {name: 'value'};
var plexWSDL = __dirname + '/plex.wsdl';

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

    debugger;
    console.log(
      result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0].Columns
        .Column[0].Name,
    );
    var res =
      result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0].Columns
        .Column;
    console.log(res[0].Name);
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].Name + res[i].Value);
    }
  });
});
