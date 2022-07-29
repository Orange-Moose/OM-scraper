// import axios from "axios";

$(document).ready(function () {
  
  
  
  
  
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
  const updateConfig = () => {
    $("input[type='text']").css('border-color', 'rgba(199, 196, 196, 0.8)');
    const interval = parseInt($("input[name='timer-input']").val());
    
    // Verify input to be number and less than 7 chars
    if (interval && typeof(interval) == 'number' && interval <= 100000) {
      axios
        .post('/update-config', { interval })
        .then(res => {
          // imediately set input value to the response value
          return $("input[name='timer-input']").val(res.data);
        })
        .catch(err => console.log(err));
    } else {
      $("input[type='text']").css('border-color', 'rgb(248, 131, 121)');
    }

  };





// FIX FUNCTION BELOW__________________________


  // Add scraping log data to the DOM after every check (max 20 checks)
  const showScraperLogs = async (data) => {
    console.log('Running showScraperLogs');

    let logLimit = 20;
    let loopId;
    let html = `
      <p>Last check: ${data.date}. Url count: ${data.urlCount}. New url count: ${data.newUrls.length}.</p>
    `;
    let delay = await axios
      .get('/config')
      .then(interval => interval.data)
      .catch(err => console.log(err));

    console.log(html);
    console.log(delay);

    loopId = setInterval(() => {
      while (logLimit) {
        logLimit--;
        console.log(logLimit);
        $(".check-logs").prepend(html);
      } 
    }, 1000 * delay);

    if (!logLimit) {
      clearInterval(loopId);
      $(".check-logs").html('');
    };

  };

  
  
  // Event handlers
  $("button.status-btn").click(async () => {
    const data = await getStateData();
    updateStateDom(data);
    showScraperLogs(data);
  });
  $("button.config-btn").click(updateConfig);
  
  // Input field  value 'styling'
  $("input[name='timer-input']").on('click focusin', function () {this.value = '';});


// jquery END
});