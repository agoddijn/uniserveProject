<script language="javascript" type="text/javascript">
	<!--

	function write_loading(_page) {

		_page.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" ');
		_page.write('"DTD/xhtml1-transitional.dtd">\n<html><body style="background: #F4F4F4">\n');
		_page.write('<table border="0" width="100%" cellspacing="0" cellpadding="0" ');
		_page.write('align="center">\n<tr>\n<td align="center">\n<br/><br/>\n');
		_page.write('<span style="font-size: 14px; font-family: Verdana, Arial; color: #103163;">\n');
		_page.write('<b><?=_("Page is being generated; please wait");?>...</b>\n');
		_page.write('</span>\n<br/><br/>\n<img src="" id="load1" ');
		_page.write('alt="" title="<?=_("Loading..");?>" border="0"/>\n</td>\n</tr>\n</table>\n');
		_page.write('</body>\n</html>\n');

		_page.getElementById("load1").src = parent.menu.loading_image.src;
		_page.close();

		return;
	}

	//-->
</script>
