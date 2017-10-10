<?php

class PBrowser {

    var $_majorVersion = 0;
    var $_minorVersion = 0;
    var $_browser = '';
    var $_agent = '';
    var $_accept = '';
    var $_platform = '';

    var $_robots = array('ZyBorg', 'Googlebot', 'Scooter/',
                         'Slurp.so', 'MuscatFerret',
                         'ArchitextSpider', 'Arachnoidea',
                         'ExtractorPro', 'ia_archiver',
                         'webbandit', 'Gulliver/',
                         'Slurp/cat', 'geckobot',
                         'KIT-Fireball', 'InfoSeek',
                         'Lycos_Spider', 'fido/',
                         'LEIA/', 'polybot');

    var $_features = array('html'       => true,
                           'hdml'       => false,
                           'wml'        => false,
                           'images'     => true,
                           'iframes'    => false,
                           'frames'     => true,
                           'tables'     => true,
                           'java'       => true,
                           'javascript' => true,
                           'dom'        => false,
                           'utf'        => false,
                           'rte'        => false);

    var $_quirks = array('must_cache_forms'           => false,
                         'avoid_popup_windows'        => false,
                         'cache_ssl_downloads'        => false,
                         'break_disposition_header'   => false,
                         'break_disposition_filename' => false,
                         'empty_file_input_value'     => false,
                         'scrollbar_in_way'           => false,
                         'cache_same_url'             => false,
                         'ow_gui_1.3'                 => false,
                         'scroll_tds'                 => false,
                         'no_filename_spaces'         => false,
                         'broken_multipart_form'      => false,
                         'double_linebreak_textarea'  => false,
                         'buggy_compression'          => false);

    /**
     * List of viewable image MIME subtypes.
     * This list of viewable images works for IE and Netscape/Mozilla.
     *
     * @var array $_images
     */
    var $_images = array('jpeg', 'gif', 'png', 'pjpeg', 'x-png', 'bmp', 'tiff');

    /**

    /**
     * Returns a reference to the global Browser object, only creating it
     * if it doesn't already exist.
     *
     * This method must be invoked as:
     *   $browser = &Browser::singleton([$userAgent[, $accept]]);
     *
     * @access public
     *
     * @param optional string $userAgent  The browser string to parse.
     * @param optional string $accept     The HTTP_ACCEPT settings to use.
     *
     * @return object Horde_Browser  The Horde_Browser instance.
     */
    static function &singleton($userAgent = null, $accept = null)
    {
        static $instances;

        if (!isset($instances)) {
            $instances = array();
        }

        $signature = serialize(array($userAgent, $accept));
        if (!array_key_exists($signature, $instances)) {
            $instances[$signature] = new PBrowser($userAgent, $accept);
        }

        return $instances[$signature];
    }

    /**
     * Create a browser instance (Constructor).
     *
     * @access public
     *
     * @param optional string $userAgent  The browser string to parse.
     * @param optional string $accept     The HTTP_ACCEPT settings to use.
     */
    function PBrowser($userAgent = null, $accept = null)
    {
        $this->match($userAgent, $accept);
    }

    /**
     * Parses the user agent string and inititializes the object with
     * all the known features and quirks for the given browser.
     *
     * @access public
     *
     * @param optional string $userAgent  The browser string to parse.
     * @param optional string $accept     The HTTP_ACCEPT settings to use.
     */
    function match($userAgent = null, $accept = null)
    {
        // Set our agent string.
        if (is_null($userAgent)) {
            if (array_key_exists('HTTP_USER_AGENT', $_SERVER)) {
                $this->_agent = trim($_SERVER['HTTP_USER_AGENT']);
            }
        } else {
            $this->_agent = $userAgent;
        }

        // Set our accept string.
        if (is_null($accept)) {
            if (array_key_exists('HTTP_ACCEPT', $_SERVER)) {
                $this->_accept = strtolower(trim($_SERVER['HTTP_ACCEPT']));
            }
        } else {
            $this->_accept = strtolower($accept);
        }

        // Check for UTF support.
        if (array_key_exists('HTTP_ACCEPT_CHARSET', $_SERVER)) {
            $this->setFeature('utf', strstr(strtolower($_SERVER['HTTP_ACCEPT_CHARSET']), 'utf'));
        }

        if (!empty($this->_agent)) {
            $this->_setPlatform();

            if (preg_match('|Opera[/ ]([0-9.]+)|', $this->_agent, $version)) {
                $this->setBrowser('opera');
                list($this->_majorVersion, $this->_minorVersion) = explode('.', $version[1]);
                $this->setFeature('javascript', true);
                $this->setQuirk('no_filename_spaces');

                switch ($this->_majorVersion) {
                case 7:
                    $this->setFeature('dom');
                    $this->setFeature('iframes');
                    $this->setQuirk('double_linebreak_textarea');
                    break;
                }

            } elseif ((preg_match('|MSIE ([0-9.]+)|', $this->_agent, $version)) ||
                      (preg_match('|Internet Explorer/([0-9.]+)|', $this->_agent, $version))) {

                $this->setBrowser('msie');
                $this->setQuirk('cache_ssl_downloads');
                $this->setQuirk('cache_same_url');
                $this->setQuirk('break_disposition_filename');

                if (strstr($version[1], '.')) {
                    list($this->_majorVersion, $this->_minorVersion) = explode('.', $version[1]);
                } else {
                    $this->_majorVersion = $version[1];
                    $this->_minorVersion = 0;
                }

                /* Some IE 6's have buggy compression:
                   http://lists.horde.org/archives/imp/Week-of-Mon-20030407/031952.html
                */
                if (preg_match('|Mozilla/4.0 \(compatible; MSIE 6.0; Windows NT 5.|', $this->_agent)) {
                    $this->setQuirk('buggy_compression');
                }
    
                switch ($this->_majorVersion) {
                case 6:
                    $this->setFeature('javascript', 1.4);
                    $this->setFeature('dom');
                    $this->setFeature('iframes');
                    $this->setFeature('utf');
                    $this->setFeature('rte');
                    $this->setQuirk('scrollbar_in_way');
                    $this->setQuirk('broken_multipart_form');
                    break;

                case 5:
                    if ($this->getPlatform() == 'mac') {
                        $this->setFeature('javascript', 1.2);
                    } else {
                        // MSIE 5 for Windows.
                        $this->setFeature('javascript', 1.4);
                        $this->setFeature('dom');
                    }
                    $this->setFeature('iframes');
                    $this->setFeature('utf');
                    if ($this->_minorVersion == 5) {
                        $this->setQuirk('break_disposition_header');
                        $this->setQuirk('broken_multipart_form');
                    }
                    if ($this->_minorVersion >= 5) {
                        $this->setFeature('rte');
                    }
                    break;

                case 4:
                    $this->setFeature('javascript', 1.2);
                    if ($this->_minorVersion > 0) {
                        $this->setFeature('utf');
                    }
                    break;

                case 3:
                    $this->setFeature('javascript', 1.1);
                    $this->setQuirk('avoid_popup_windows');
                    break;
                }

            } elseif (preg_match('|Elaine/([0-9]+)|', $this->_agent, $version) ||
                      preg_match('|Digital Paths|', $this->_agent, $version)) {
                $this->setBrowser('palm');
                $this->setFeature('images', false);
                $this->setFeature('frames', false);
                $this->setFeature('javascript', false);
                $this->setQuirk('avoid_popup_windows');

            } elseif (preg_match('|ANTFresco/([0-9]+)|', $this->_agent, $version)) {
                $this->setBrowser('fresco');
                $this->setFeature('javascript', 1.1);
                $this->setQuirk('avoid_popup_windows');

            } elseif (preg_match('|Konqueror/([0-9]+)|', $this->_agent, $version) || 
                      preg_match('|Safari/([0-9]+)|', $this->_agent, $version)) {
                // Konqueror and Apple's Safari both use the KHTML
                // rendering engine.
                $this->setBrowser('konqueror');
                $this->setQuirk('empty_file_input_value');
                $this->_majorVersion = $version[1];

                if (strpos($this->_agent, 'Safari') !== false &&
                    // Safari
                    $this->_majorVersion >= 60) {
                    $this->setFeature('javascript', 1.4);
                    $this->setFeature('dom');
                    $this->setFeature('iframes');
                } else {
                    // Konqueror.
                    $this->setBrowser('konqueror');
                    $this->setFeature('javascript', 1.1);
                    switch ($this->_majorVersion) {
                    case 3:
                        $this->setFeature('dom');
                        $this->setFeature('iframes');
                        break;
                    }
                }

            } elseif (preg_match('|Mozilla/([0-9.]+)|', $this->_agent, $version)) {
                $this->setBrowser('mozilla');
                $this->setQuirk('must_cache_forms');

                list($this->_majorVersion, $this->_minorVersion) = explode('.', $version[1]);
                switch ($this->_majorVersion) {
                case 5:
                    if ($this->getPlatform() == 'win') {
                        $this->setQuirk('break_disposition_filename');
                    }
                    $this->setFeature('javascript', 1.4);
                    $this->setFeature('dom');
                    $this->setFeature('rte');
                    if (preg_match('|rv:(.*)\)|', $this->_agent, $revision)) {
                        if ($revision[1] >= 1) {
                            $this->setFeature('iframes');
                        }
                    }
                    break;

                case 4:
                    $this->setFeature('javascript', 1.3);
                    $this->setFeature('rte');
                    $this->setQuirk('buggy_compression');
                    break;

                case 3:
                default:
                    $this->setFeature('javascript', 1);
                    $this->setQuirk('buggy_compression');
                    break;
                }

            } elseif (preg_match('|Lynx/([0-9]+)|', $this->_agent, $version)) {
                $this->setBrowser('lynx');
                $this->setFeature('images', false);
                $this->setFeature('frames', false);
                $this->setFeature('javascript', false);
                $this->setQuirk('avoid_popup_windows');

            } elseif (preg_match('|Links \(([0-9]+)|', $this->_agent, $version)) {
                $this->setBrowser('links');
                $this->setFeature('images', false);
                $this->setFeature('frames', false);
                $this->setFeature('javascript', false);
                $this->setQuirk('avoid_popup_windows');

            } elseif (preg_match('|HotJava/([0-9]+)|', $this->_agent, $version)) {
                $this->setBrowser('hotjava');
                $this->setFeature('javascript', false);

            } elseif (strstr($this->_agent, 'UP/') ||
                      strstr($this->_agent, 'UP.B')) {
                $this->setBrowser('up');
                $this->setFeature('html', false);
                $this->setFeature('javascript', false);
                $this->setFeature('hdml');
                $this->setFeature('wml');

                if (strstr($this->_agent, 'GUI') &&
                    strstr($this->_agent, 'UP.Link')) {
                    /* The device accepts Openwave GUI extensions for
                       WML 1.3. Non-UP.Link gateways sometimes have
                       problems, so exclude them. */
                    $this->setQuirk('ow_gui_1.3');
                }

            } elseif (strstr($this->_agent, 'Nokia')) {
                $this->setBrowser('nokia');
                $this->setFeature('html', false);
                $this->setFeature('wml');
                $this->setFeature('xhtml');

            } elseif (strstr($this->_agent, 'Ericsson')) {
                $this->setBrowser('ericsson');
                $this->setFeature('html', false);
                $this->setFeature('wml');

            } elseif (stristr($this->_agent, 'Wap')) {
                $this->setBrowser('wap');
                $this->setFeature('html', false);
                $this->setFeature('javascript', false);
                $this->setFeature('hdml');
                $this->setFeature('wml');

            } elseif (strstr(strtolower($this->_agent), 'docomo') ||
                      strstr(strtolower($this->_agent), 'portalmmm')) {
                $this->setBrowser('imode');
                $this->setFeature('images', false);

            } elseif (strstr(strtolower($this->_agent), 'avantgo')) {
                $this->setBrower('avantgo');

            } elseif (strstr(strtolower($this->_agent), 'j-')) {
                $this->setBrowser('mml');
            }
        }
    }

    /**
     * Match the platform of the browser.
     *
     * This is a pretty simplistic implementation, but it's intended
     * to let us tell what line breaks to send, so it's good enough
     * for its purpose.
     *
     * @access public
     *
     * @since Horde 2.2
     */
    function _setPlatform()
    {
        if (stristr($this->_agent, 'wind')) {
            $this->_platform = 'win';
        } elseif (stristr($this->_agent, 'mac')) {
            $this->_platform = 'mac';
        } else {
            $this->_platform = 'unix';
        }
    }

    /**
     * Return the currently matched platform.
     *
     * @return string  The user's platform.
     *
     * @since Horde 2.2
     */
    function getPlatform()
    {
        return $this->_platform;
    }

    /**
     * Sets the current browser.
     *
     * @access public
     *
     * @param string $browser  The browser to set as current.
     */
    function setBrowser($browser)
    {
        $this->_browser = $browser;
    }

    /**
     * Determine if the given browser is the same as the current.
     *
     * @access public
     *
     * @param string $browser  The browser to check.
     *
     * @return boolean  Is the given browser the same as the current?
     */
    function isBrowser($browser)
    {
        return ($this->_browser === $browser);
    }

    /**
     * Do we consider the current browser to be a mobile device?
     *
     * @return boolean  True if we do, false if we don't.
     */
    function isMobile()
    {
        switch ($this->_browser) {
        case 'avantgo':
        case 'ericsson':
        case 'imode':
        case 'mml':
        case 'nokia':
        case 'palm':
        case 'up':
        case 'wap':
            return true;
            break;
        }

        return false;
    }

    /**
     * Retrieve the current browser.
     *
     * @access public
     *
     * @return string  The current browser.
     */
    function getBrowser()
    {
        return $this->_browser;
    }

    /**
     * Retrieve the current browser's major version.
     *
     * @access public
     *
     * @return int  The current browser's major version.
     */
    function getMajor()
    {
        return $this->_majorVersion;
    }

    /**
     * Retrieve the current browser's minor version.
     *
     * @access public
     *
     * @return int  The current browser's minor version.
     */
    function getMinor()
    {
        return $this->_minorVersion;
    }

    /**
     * Retrieve the current browser's version.
     *
     * @access public
     *
     * @return string  The current browser's version.
     */
    function getVersion()
    {
        return $this->_majorVersion . '.' . $this->_minorVersion;
    }

    /**
     * Set unique behavior for the current browser.
     *
     * @access public
     *
     * @param string $quirk           The behavior to set.
     * @param optional string $value  Special behavior parameter.
     */
    function setQuirk($quirk, $value = true)
    {
        $this->_quirks[$quirk] = $value;
    }

    /**
     * Check unique behavior for the current browser.
     *
     * @access public
     *
     * @param string $quirk  The behavior to check.
     *
     * @return boolean  Does the browser have the behavior set?
     */
    function hasQuirk($quirk)
    {
        return !empty($this->_quirks[$quirk]);
    }

    /**
     * Retreive unique behavior for the current browser.
     *
     * @access public
     *
     * @param string $quirk  The behavior to retreive.
     *
     * @return string  The value for the requested behavior.
     */
    function getQuirk($quirk)
    {
        return array_key_exists($quirk, $this->_quirks)
               ? $this->_quirks[$quirk]
               : null;
    }

    /**
     * Set capabilities for the current browser.
     *
     * @access public
     *
     * @param string $feature         The capability to set.
     * @param optional string $value  Special capability parameter.
     */
    function setFeature($feature, $value = true)
    {
        $this->_features[$feature] = $value;
    }

    /**
     * Check the current browser capabilities.
     *
     * @access public
     *
     * @param string $feature  The capability to check.
     *
     * @return boolean  Does the browser have the capability set?
     */
    function hasFeature($feature)
    {
        return !empty($this->_features[$feature]);
    }

    /**
     * Retreive the current browser capability.
     *
     * @access public
     *
     * @param string $feature  The capability to retreive.
     *
     * @return string  The value of the requested capability.
     */
    function getFeature($feature)
    {
        return array_key_exists($feature, $this->_features)
               ? $this->_features[$feature]
               : null;
    }

    /**
     * Returns the headers for a browser download.
     *
     * @access public
     *
     * @param optional string $filename  The filename of the download.
     * @param optional string $cType     The content-type description of the
     *                                   file.
     * @param optional boolean $inline   True if inline, false if attachment.
     * @param optional string $cLength   The content-length of this file.
     *
     * @since Horde 2.2
     */
    function downloadHeaders($filename = 'unknown', $cType = null,
                             $inline = false, $cLength = null)
    {
        /* Some browsers don't like spaces in the filename. */
        if ($this->hasQuirk('no_filename_spaces')) {
            $filename = strtr($filename, ' ', '_');
        }

        /* MSIE doesn't like multiple periods in the file name. Convert
           all periods (except the last one) to underscores. */
        if ($this->isBrowser('msie')) {
            if (($pos = strrpos($filename, '.'))) {
                $filename = strtr(substr($filename, 0, $pos), '.', '_') . substr($filename, $pos);
            }
        }

        /* Content-Type/Content-Disposition Header. */
        if ($inline) {
            if (!is_null($cType)) {
                header('Content-Type: ' . trim($cType));
            } elseif ($this->isBrowser('msie')) {
                header('Content-Type: application/x-msdownload');
            } else {
                header('Content-Type: application/octet-stream');
            }
            header('Content-Disposition: inline; filename=' . $filename);
        } else {
            if ($this->isBrowser('msie')) {
                header('Content-Type: application/x-msdownload');
            } elseif (!is_null($cType)) {
                header('Content-Type: ' . trim($cType));
            } else {
                header('Content-Type: application/octet-stream');
            }

            if ($this->hasQuirk('break_disposition_header')) {
                header('Content-Disposition: filename=' . $filename);
            } else {
                header('Content-Disposition: attachment; filename=' . $filename);
            }
        }

        /* Content-Length Header. Don't send Content-Length for HTTP/1.1
           servers. */
	$protocol = NULL;

	if (array_key_exists('SERVER_PROTOCOL', $_SERVER)) {
		if (($pos = strrpos($_SERVER['SERVER_PROTOCOL'], '/'))) {
			$protocol = substr($_SERVER['SERVER_PROTOCOL'], $pos + 1);
		}
	}

        if (($protocol != '1.1') && !is_null($cLength)) {
            header('Content-Length: ' . $cLength);
        }

        /* Overwrite Pragma: and other caching headers for IE. */
        if ($this->hasQuirk('cache_ssl_downloads')) {
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
        }
    }

    /**
     * Determines if the browser is a robot or not.
     *
     * @access public
     *
     * @return boolean  True if browser is a known robot.
     */
    function isRobot()
    {
        if (in_array($this->_agent, $this->_robots)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Determines if a browser can display a given MIME type.
     *
     * @access public
     *
     * @param string $mimetype  The MIME type to check.
     *
     * @return boolean  True if the browser can display the MIME type.
     */
    function isViewable($mimetype)
    {
        if (!empty($this->_accept)) {
            return $this->_acceptMIMEType($mimetype);
        } else {
            if (!$this->hasFeature('images')) {
                return false;
            }

            list($type, $subtype) = explode('/', strtolower($mimetype));
            if ($type != 'image') {
                return false;
            }

            if (in_array($subtype, $this->_images)) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Determines if a browser accepts a given MIME type.
     *
     * @access private
     *
     * @param string $mimetype  The MIME type to check.
     *
     * @return boolean  True if the browser accepts the MIME type.
     */
    function _acceptMIMEType($mimetype)
    {
        global $gBrowser;

        if (strstr('*/*', $this->_accept)) {
            return true;
        }

        if (strstr($this->_accept, strtolower($mimetype))) {
            return true;
        }

        /* image/jpeg and image/pjpeg *appear* to be the same entity, but
           mozilla don't seem to want to accept the latter.  For our
           purposes, we will treat them the same. */
        if ($gBrowser->isBrowser('mozilla') &&
            (strtolower($mimetype) == 'image/pjpeg') &&
            strstr($this->_accept, 'image/jpeg')) {
            return true;
        }

        return false;
    }

    /**
     * Escape characters in javascript code if the browser requires it.
     * %23, %26, and %2B (for IE) and %27 need to be escaped or else
     * jscript will interpret it as a single quote, pound sign, or
     * ampersand and refuse to work.
     *
     * @access public
     *
     * @param string $code  The JS code to escape.
     *
     * @return string  The escaped code.
     */
    function escapeJSCode($code)
    {
        $from = $to = array();

        if ($this->isBrowser('msie') ||
            ($this->isBrowser('mozilla') && ($this->getMajor() >= 5))) {
            $from = array('%23', '%26', '%2B');
            $to = array(urlencode('%23'), urlencode('%26'), urlencode('%2B'));
        }
        $from[] = '%27';
        $to[] = '\%27';

        return str_replace($from, $to, $code);
    }

}

?>
