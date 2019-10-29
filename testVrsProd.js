const soap = require('soap');
const mqtt = require('mqtt');
const fs = require('fs');

// At the bottom of the wsdl file you will find the http address of the service
const prodPlexWSDL = __dirname + '/plex-pro.wsdl';
const testPlexWSDL = __dirname + '/plex-test.wsdl';

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

async function getTestContainer() {
  var p1Value, p2Value;
  soap.createClient(testPlexWSDL, function(err, client) {
    debugger;
    // we now have a soapClient - we also need to make sure there's no `err` here.
    if (err) {
      return client.status(500).json(err);
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
        return result.status(500).json(err);
      }

      p1Value =
        result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0]
          .Columns.Column[14].Value;
      console.log(`test:part_no 68302928AC = ${p1Value}`);
      client.ExecuteDataSource(p2_request_data, function(err, result) {
        // we now have a soapClient - we also need to make sure there's no `err` here.
        if (err) {
          return result.status(500).json(err);
        }

        p2Value =
          result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0]
            .Columns.Column[14].Value;
        console.log(`test:part_no 68302928AC = ${p2Value}`);
        fs.appendFile('CNC422.csv', `${p1Value},${p2Value}\n`, err => {
          if (!err) {
            console.log('Appended');
          }
        });
      });
    });
  });
}

async function getProdContainer() {
  var p1Value, p2Value;
  soap.createClient(prodPlexWSDL, function(err, client) {
    debugger;
    // we now have a soapClient - we also need to make sure there's no `err` here.
    if (err) {
      return client.status(500).json(err);
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
        return result.status(500).json(err);
      }

      p1Value =
        result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0]
          .Columns.Column[14].Value;
      console.log(`prod:part_no 68302928AC = ${p1Value}`);
      client.ExecuteDataSource(p2_request_data, function(err, result) {
        // we now have a soapClient - we also need to make sure there's no `err` here.
        if (err) {
          return result.status(500).json(err);
        }

        p2Value =
          result.ExecuteDataSourceResult.ResultSets.ResultSet[0].Rows.Row[0]
            .Columns.Column[14].Value;
        console.log(`prod:part_no 68302928AC = ${p2Value}`);
        fs.appendFile('CNC422.csv', `${p1Value},${p2Value},`, err => {
          if (!err) {
            console.log('Appended');
            getTestContainer();
          }
        });
      });
    });
  });
}

function main() {
  var client = mqtt.connect(
    'mqtt://ec2-18-218-2-29.us-east-2.compute.amazonaws.com',
  );
  // var client  = mqtt.connect('mqtt://test.mosquitto.org')

  client.on('connect', function() {
    client.subscribe('CNC422/Cycle_Counter_Shift_SL', function(err) {
      if (!err) {
        console.log('subscribed to: CNC422/Cycle_Counter_Shift_SL');
      }
    });
  });

  client.on('message', function(topic, message) {
    let date_ob = new Date();
    let date = ('0' + date_ob.getDate()).slice(-2);
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let dateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    console.log(dateTime);

    // message is Buffer
    let Cycle_Counter_Shift_SL = message.toString();
    let disp = `CNC422/Cycle_Counter_Shift_SL = ${Cycle_Counter_Shift_SL}`;
    console.log(disp);
    fs.appendFile(
      'CNC422.csv',
      `${dateTime},${Cycle_Counter_Shift_SL},`,
      err => {
        if (!err) {
          console.log('Appended');
          getProdContainer();
        }
      },
    );
    //  client.end()
  });
}
main();
