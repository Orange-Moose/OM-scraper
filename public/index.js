$(document).ready(function () {
  
  const getStateData = async () => {    
    // Get new data and format html
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

  $("button.status-btn").click(getStateData);

});