function goToLink() {
    let selectBox = document.getElementById('hyperlinkSelect');
    let selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if (selectedValue) {
      window.location.href = selectedValue;
    }
  }