// import axios from "axios";

$(document).ready(function () {
  
  // Get new data and update html
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

  // Update config parameters and re-run scraper
  const updateConfig = () => {
    $("input[type='text']").css('border-color', 'rgba(199, 196, 196, 0.8)');
    const interval = parseInt($("input[name='timer-input']").val());
    // console.log(`Delay: ${interval},  type: ${typeof(interval)}, les than 100k: ${interval <= 100000}`);
    
    // Verify input to be number and less than 7 chars
    if (interval && typeof(interval) == 'number' && interval <= 100000) {
      axios
        .post('/update-config', { interval })
        .then(res => {
          console.log(res.data);
          // imediately set input value to the response value
          return $("input[name='timer-input']").val(res.data);
        })
        .catch(err => console.log(err));
    } else {
      $("input[type='text']").css('border-color', 'rgb(248, 131, 121)');
    }

  };

  // Add log to the DOM after every check
  const updateLog = () => {
    
  };

  
  
  // Event handlers
  $("button.status-btn").click(getStateData);
  $("button.config-btn").click(updateConfig);
  
  // Input field  value 'styling'
  $("input[name='timer-input']").on('click focusin', function () {this.value = '';});


// jquery END
});