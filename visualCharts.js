google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(drawChart);

async function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Type');
  data.addColumn('number', 'Times');
  
  let [home, img, location, data1] = await Promise.all([
    get("home"),
    get("random_image"),
    get("location"),
    get("data"),
  ])
  
  data.addRows([
    ['Home Page' , home?.count || 0],
    ['Random Pictures Page' , img?.count || 0],
    ['Location Info Page' , location?.count || 0],
    ['User Activity Page' , data1?.count || 0]
  ]);


  var options = {'title':'Pages Visit Data',
                 'width': document.body.clientWidth * .80,
                 'height':320};

  var chart = new google.visualization.PieChart(document.getElementById('vis'));
  chart.draw(data, options);
}