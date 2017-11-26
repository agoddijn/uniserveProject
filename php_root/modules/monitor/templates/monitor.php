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
    function m8sready(){
      window.location = (""+window.location).replace(/#[A-Za-z0-9_]*$/,'')+"#menu_ul";
      var iframeheight = window.innerHeight - 60;
      document.getElementById('monitoringframe').style.height = iframeheight + "px";
    }
    
    if (document.readyState !== 'loading') {
      m8sready();
    } else {
      document.addEventListener('DOMContentLoaded', m8sready);
    }
</script>

<iframe src="/monitoringframe.html"  id="monitoringframe">
  <p>Iframes are required for monitoring. Your browser does not support iframes.</p>
</iframe>



