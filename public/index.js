$(document).ready(function () {
  
  // Logs container DOM updating loop from showScraperLogs()
  let logLoopId;
  //How many logs to display to the user before refreshing.
  const logCount = 20;
  
  const getStateData = async () => {    
    return await axios
      .get('/state')
      .then((state) => state.data)
      .catch(err => console.log(err));
  };

  const updateStateDom = (data) => {
    const html = `
          <p>Last check: ${data.date}.</p>
          <p>Url count: ${data.urlCount}.</p>
          <p>New url count: ${data.newUrls.length}.</p>
          <p>New url list:
          ${data.newUrls.join('\n')}</p>
        `;
    $(".check-data").html(html);
  };

  // Update scraper config parameters
  const updateConfig = (loopId) => {
    $("input[type='text']").css('border-color', 'rgba(199, 196, 196, 0.8)');
    const interval = parseInt($("input[name='timer-input']").val());
    
    // Verify input to be number and less than 7 chars
    if (interval && typeof(interval) == 'number' && interval <= 100000) {
      axios
        .post('/update-config', { interval })
        .then(res => {
          // Restart loging to the DOM
          clearInterval(loopId);
          $(".check-logs").html('Resetting timer...');
          showScraperLogs(logCount, res.data);
          // update input value to the response value
          return $("input[name='timer-input']").val(res.data);
        })
        .catch(err => console.log(err));
    } else {
      $("input[type='text']").css('border-color', 'rgb(248, 131, 121)');
    }
  };


  // Add scraping log data to the DOM after every check
  const showScraperLogs = async (logCount, delay) => {
    let logLimit = logCount;
    let loopId;

    // If no delay value was passed, fetch new one from /config
    if(!delay) delay = await axios
        .get('/config')
        .then(interval => interval.data)
        .catch(err => console.log(err));
    
    $(".check-logs").html('Waiting for new logs...');
    
    loopId = setInterval( async () => {
      let data = await getStateData();
      let html = `
      <p>Last check: ${data.date}. Url count: ${data.urlCount}. New url count: ${data.newUrls.length}.</p>
      `;

      $(".check-logs").prepend(html);
      logLimit--; 

      if(logLimit < 0) {
        $(".check-logs").html('');
        logLimit = logCount;
      };
    }, 1000 * delay);

    // Set refference of setInterval
    logLoopId = loopId;
  };

  // Event handlers
  $("button.status-btn").click(async () => {
    const data = await getStateData();
    updateStateDom(data);
  });

  $("button.config-btn").click(() => updateConfig(logLoopId));
  
  // Input field  value 'styling'
  $("input[name='timer-input']").on('click focusin', function () {this.value = '';});

  // Start loging to DOM on pageload
  showScraperLogs(logCount);


// jquery END
});