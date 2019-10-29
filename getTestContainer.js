var soap = require('soap');
const mqtt = require('mqtt');

// At the bottom of the wsdl file you will find the http address of the service
var prodURL = '/plex-pro.wsdl';
var testURL = '/plex-test.wsdl';

// CNC422
// WorkcenterGroup/WorkCenter
// GA FWD Knuckle/FWD BE 517
// Serial_No:BV066669
var p1_request_data = {
  ExecuteDataSourceRequest: {
    DataSourceKey: '10837',
    InputParameters: {
      InputParameter: {
        Name: 'Serial_No',
        Value: 'BV066669', //part_no = 68302928AC
        Required: 'true',
        Output: 'false',
      },
    },
  },
};
var p2_request_data = {
  ExecuteDataSourceRequest: {
    DataSourceKey: '10837',
    InputParameters: {
      InputParameter: {
        Name: 'Serial_No',
        Value: 'BV066691', // part_no = 68303171AC
        Required: 'true',
        Output: 'false',
      },
    },
  },
};

var plexWSDL = __dirname + prodURL;
// var plexWSDL = __dirname + testURL;

async function getContainer() {
  soap.createClient(plexWSDL, function(err, client) {
    debugger;
    // we now have a soapClient - we also need to make sure there's no `err` here.
    if (err) {
      return res.status(500).json(err);
    }
    debugger;
    client.setSecurity(
      new soap.BasicAuthSecurity(
        'BuscheAvillaKorsws@plex.com',
        '5b11b45-f59f-',
      ),
    );
    debugger;
    client.ExecuteDataSource(p1_request_data, function(err, result) {
      // we now have a soapClient - we also need to make sure there's no `err` here.
      if (err) {
        return res.status(500).json(err);
      }

      console.log(
        result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0]
          .Columns.Column[14],
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
    client.ExecuteDataSource(p2_request_data, function(err, result) {
      // we now have a soapClient - we also need to make sure there's no `err` here.
      if (err) {
        return res.status(500).json(err);
      }

      console.log(
        result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0]
          .Columns.Column[14],
      );
    });
  });
}

function main(){

var client  = mqtt.connect('mqtt://ec2-18-218-2-29.us-east-2.compute.amazonaws.com')
// var client  = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
  client.subscribe('CNC422/Cycle_Counter_Shift_SL', function (err) {
    if (!err) {
        console.log('subscribed to: CNC422/Cycle_Counter_Shift_SL')
      // client.publish('house/bulb1', 'Hello mqtt')
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  getContainer();  
//  client.end()
})


}
main();
