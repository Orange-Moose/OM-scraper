import axios from "axios";

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
  const updateConfig = async () => {
    const delay = $("input[name='timer-input']").val();
    console.log(delay);

    // Verify input to be number and less than 7 chars
    if (delay && typeof (val) == 'number' && delay <= 100000) {
      axios
      .post('/update-config', { delay })
      .then(res => console.log(res))
      .catch(err => console.log(err));
    } else {
      $("input[name='timer-input']").addClass('invalid');
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