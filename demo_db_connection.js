var mysql = require('mysql');

var con = mysql.createConnection({
  host: 'ec2-3-14-133-181.us-east-2.compute.amazonaws.com',
  // host:'localhost',
  user: 'brent',
  password: 'JesusLives1!',
  insecureAuth: true,
  database: 'mach2',
});

// con.connect(function(err){
//     if(err) throw err;
//     console.log("Connected");
// })

con.connect(function(err) {

    let date_ob = new Date();
    let date = ('0' + date_ob.getDate()).slice(-2);
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let dateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  let sql = `insert into cnc422 (datetime,p1ProdQuantity,p1TestQuantity,p2ProdQuantity,p2TestQuantity) values ("${dateTime}",12,12,14,14)`;
    console.log(sql);
  // let sql = 'select * from test';
  if (err) throw err;
  console.log('Connected!');
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log('Result: ' + result);
  });
    //con.close();
});
