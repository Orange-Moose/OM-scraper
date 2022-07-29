// import axios from "axios";

$(document).ready(function () {
  
  // Update DOM with fetched state data
  const getStateData = async () => {    
    const html = await axios
      .get('/state')
      .then((state) => {
        return `
          <p>Last check: ${state.data.date}.</p>
          <p>Url count: ${state.data.urlCount}.</p>
          <p>New url count: ${state.data.newUrls.length}.</p>
          <p>New url list:
          ${state.data.newUrls.join('\n')}</p>
        `;
      })
      .catch(err => console.log(err));
      
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




// FROM HERE: FIX showScraperLogs TO ACCEPT SCRAPE INTERVAL FROM STATE


  // Add scraping log data to the DOM after every check (refresh after 20 checks)
  const showScraperLogs = async () => {
    console.log('Running showScraperLogs');
    let checkCount = 20;
    while(checkCount) {
      checkCount--;
      let logHtml = await axios
        .get('/show-logs')
        .then(state => {
          return `
            <p>Last check: ${state.data.date}. Url count: ${state.data.urlCount}. New url count: ${state.data.newUrls.length}.</p>
          `;
        })
        .catch(err => console.log(err));
      
      $(".check-logs").prepend(logHtml);
      if (!checkCount) $(".check-logs").html('');
    } 
  };

  
  
  // Event handlers
  $("button.status-btn").click(() => {
    getStateData(); 
    showScraperLogs();
  });
  $("button.config-btn").click(updateConfig);
  
  // Input field  value 'styling'
  $("input[name='timer-input']").on('click focusin', function () {this.value = '';});


// jquery END
});