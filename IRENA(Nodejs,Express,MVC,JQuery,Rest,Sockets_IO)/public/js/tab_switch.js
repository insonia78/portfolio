function toggleTab(evt,mode){
  var containers = document.getElementsByClassName("io-container");
  for (i=0;i<containers.length;i++){
    containers[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace("active", "");
  }
  document.getElementById(mode).style.display = "block";
  //window.dispatchEvent(new Event('resize')); //Charts stop rendering when display is changed from none. This dispatch event laods the chart again.
  evt.currentTarget.className+=" active";
}
