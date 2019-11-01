var mysql = require('mysql');

function insert() {
  var con = mysql.createConnection({
    // host: 'ec2-3-14-133-181.us-east-2.compute.amazonaws.com',
    host: 'localhost',
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
    // let sql =
    //       `insert into ProdVrsTest `
    //       + `(TransDate,p1ProdQuantity,p1TestQuantity,p2ProdQuantity,p2TestQuantity) values ("${dateTime}",12,12,14,14)`;
let sql =`insert into Control_Panel_Setup_Containers_Get ` +
          `( TransDate,ProdServer, Part_No ) values ( ` +
`"${dateTime}",false,"1234567889ABC" )`
    //   Name varchar(50) NULL,
//   Multiple bool NULL,
//   Container_Note varchar(50) NULL,
//   Cavity_Status_Key MEDIUMINT NULL,
//   Container_Status varchar(50) NULL,
//   Defect_Type varchar(50) NULL,
//   Serial_No varchar(50) NULL,
//   Setup_Container_Key MEDIUMINT NULL,
//   Count MEDIUMINT NULL,
//   Part_Count MEDIUMINT NULL,
//   Part_Key MEDIUMINT NULL,
//   Part_Operation_Key MEDIUMINT NULL,
//   Standard_Container_Type varchar(50) NULL,
//   Container_Type_Key MEDIUMINT NULL,
//   Parent_Part varchar(50) NULL,
//   Parent varchar(50) NULL,
//   Cavity_No varchar(50) NULL,
//   Master_Unit_Key MEDIUMINT NULL,
//   Workcenter_Printer_Key MEDIUMINT NULL,
//   Master_Unit_No varchar(50) NULL,
//   Physical_Printer_Name varchar(50) NULL,
//   Container_Count MEDIUMINT NULL,
//   Container_Quantity MEDIUMINT NULL,
//   Default_Printer varchar(50) NULL,
//   Default_Printer_Key MEDIUMINT NULL,
//   Class_Key MEDIUMINT NULL,
//   Quantity MEDIUMINT NULL,
//   Companion Bool NULL,
//   Container_Type varchar(50) NULL,
//   Container_Type_Description varchar(50) NULL,
//   Sort_Order MEDIUMINT NULL,

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
}
insert();
