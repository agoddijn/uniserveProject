<?php

?>

<style type="text/css">
#monitoringframe {
  border: none;
  position: absolute;
  left: 0px;
  top: 155px;
}

#spacer {

}
</style>

    <script type="text/javascript">
        function getScrollbarWidth() {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }

    function m8sready(){
      window.location = (""+window.location).replace(/#[A-Za-z0-9_]*$/,'')+"#menu_ul";
      var iframeheight = window.innerHeight - 60;
      document.getElementById('monitoringframe').style.height = iframeheight + "px";
      document.getElementById('spacer').style.height = iframeheight + "px";
      document.getElementById('monitoringframe').style.width = (window.innerWidth - getScrollbarWidth()) + "px";
    }

    if (document.readyState !== 'loading') {
      m8sready();
    } else {
      document.addEventListener('DOMContentLoaded', m8sready);
    }
</script>

<div id="spacer"> </div>

<iframe src="/monitoringframe.html"  id="monitoringframe">
  <p>Iframes are required for monitoring. Your browser does not support iframes.</p>
</iframe>

