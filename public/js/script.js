(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();


  // for event we adding on taxSwitch button

  let taxswitch = document.getElementById('flexSwitchCheckChecked');
  taxswitch.addEventListener('click', () => {
      console.log("clicked");
      let taxinfo = document.getElementsByClassName('tax-info');
      //    this is an array of this taxinfo           

      for (info of taxinfo) {
          if (info.style.display != 'inline') {
              info.style.display = 'inline';
          } else {
              info.style.display = 'none';
          }
      }

  });

  
