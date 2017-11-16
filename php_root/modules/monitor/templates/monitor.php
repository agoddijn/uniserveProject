<?php

?>

<style type="text/css">
#monitoringframe {
  width: 100vw;
  border: none;
  position: relative;
  left: -60px;
  top: -10px;
}
</style>

<script type="text/javascript">
    window.location = (""+window.location).replace(/#[A-Za-z0-9_]*$/,'')+"#menu_ul";
    var iframeheight = window.innerHeight - 50;
    document.getElementById('monitoringframe').style.height = iframeheight + "px";
    console.log("windowheight: " + window.innerHeight);
</script>

<iframe src="/monitoringframe.html" title="Monitoring Iframe" id="monitoringframe">
  <p>Your browser does not support iframes.</p>
</iframe>


