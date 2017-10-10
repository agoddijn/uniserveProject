<?php

//
// Database Types
//
@define('DB_MYSQL',	1);
@define('DB_PGSQL',	2);
@define('DB_SQLITE',	3);

//
// Database error codes (stolen from Pear::DB)
//
@define('DB_OK',                         1);
@define('DB_ERROR',                     -1);
@define('DB_ERROR_SYNTAX',              -2);
@define('DB_ERROR_CONSTRAINT',          -3);
@define('DB_ERROR_NOT_FOUND',           -4);
@define('DB_ERROR_ALREADY_EXISTS',      -5);
@define('DB_ERROR_UNSUPPORTED',         -6);
@define('DB_ERROR_MISMATCH',            -7);
@define('DB_ERROR_INVALID',             -8);
@define('DB_ERROR_NOT_CAPABLE',         -9);
@define('DB_ERROR_TRUNCATED',          -10);
@define('DB_ERROR_INVALID_NUMBER',     -11);
@define('DB_ERROR_INVALID_DATE',       -12);
@define('DB_ERROR_DIVZERO',            -13);
@define('DB_ERROR_NODBSELECTED',       -14);
@define('DB_ERROR_CANNOT_CREATE',      -15);
@define('DB_ERROR_CANNOT_DELETE',      -16);
@define('DB_ERROR_CANNOT_DROP',        -17);
@define('DB_ERROR_NOSUCHTABLE',        -18);
@define('DB_ERROR_NOSUCHFIELD',        -19);
@define('DB_ERROR_NEED_MORE_DATA',     -20);
@define('DB_ERROR_NOT_LOCKED',         -21);
@define('DB_ERROR_VALUE_COUNT_ON_ROW', -22);
@define('DB_ERROR_INVALID_DSN',        -23);
@define('DB_ERROR_CONNECT_FAILED',     -24);
@define('DB_ERROR_EXTENSION_NOT_FOUND',-25);
@define('DB_ERROR_ACCESS_VIOLATION',   -26);
@define('DB_ERROR_NOSUCHDB',           -27);
@define('DB_ERROR_CONSTRAINT_NOT_NULL',-29);

class PDb {

	
	//
	// The database Handle
	//
	private $db = NULL;
	private $db_type;
	private $tx = 0;

	public	$count;
	public  $open = false;

	//
	// Constructor
	//
	function __construct($_dbtype) {
		$this->count = 0;
		$this->db_type = $_dbtype;
	}

	//
	// Destructor
	//
	function __destruct() {
		$this->count = 0;
		if ($this->tx == 1)
			$this->rollback();
	}

	//
	// Beging a transaction
	//
	function begin() {

		global $gError;
		
		if ($this->tx == 1) {

			$gError->_error("Db::begin(): transaction already in progress.");
			return 1;
		}
		
		switch($this->db_type) {
			case DB_MYSQL: 
				$this->tx = 1; 
				return 1;
			case DB_PGSQL:  
				if ($this->Query("BEGIN") != 0) {

					$this->tx = 1;
					return 1;
				}
			case DB_SQLITE:
				if ($this->Query("BEGIN") != 0) {
				
					$this->tx = 1;
					return 1;
				}
			default:
				$gError->_error("Db::begin(): Unknown database type id = " . $this->db_type);
				return 0;
		}
	
		return 0;
	}
	
	//
	// Commit a transaction
	//
	function commit() {

		global $gError;
		
		if ($this->tx == 0) {

			$gError->_error("Db::commit(): no transaction in progress.");
			return 0;
		}
		
		switch($this->db_type) {
			case DB_MYSQL: 
				$this->tx = 0; 
				return 1;
			case DB_PGSQL: 
				if ($this->Query("COMMIT") != 0) {

					$this->tx = 0;
					return 1;
				}
			case DB_SQLITE:
				if ($this->Query("COMMIT") != 0) {
		
					$this->tx = 0;
					return 1;
				}
			default:
				$gError->_error("Db::commit(): Unknown database type id = " . $this->db_type);
				return 0;
		}
	
		return 0;
	}

	//
	// Roll Back a transaction
	//
	function rollback() {

		global $gError;
		
		if ($this->tx == 0) {
			return 1;
		}
		
		switch($this->db_type) {
			case DB_MYSQL: 
				$this->tx = 0; 
				return 1;
			case DB_PGSQL: 
				if ($this->Query("ROLLBACK") != 0) {

					$this->tx = 0;
					return 1;
				}
			case DB_SQLITE:
				if ($this->Query("ROLLBACK") != 0) {
		
					$this->tx = 0;
					return 1;
				}
			default:
				$gError->_error("Db::rollback(): Unknown database type id = " . $this->db_type);
				return 0;
		}
	
		return 0;
	}

	//
	// Open a database Connection
	//
	function Open( $_db ) {
	
		global $gError;
		global $gConfig;

		if (!$this->db || !$this->open) {
			switch($this->db_type) {
				case DB_MYSQL:
					if ( (is_array($gConfig)) && (isset($gConfig[$_db]['host'])) && 
						(isset($gConfig[$_db]['user'])) && (isset($gConfig[$_db]['pass'])) &&
						(isset($gConfig[$_db]['name'])) ) {

						$this->db = @mysql_pconnect($gConfig[$_db]['host'], $gConfig[$_db]['user'],
							$gConfig[$_db]['pass']);
						
						if ($this->db == FALSE) {
							//$gError->_error("Db::Open(): " . $this->_error());
							throw new Exception($this->_error());
							return 0;
						}
 						if (@mysql_select_db($gConfig[$_db]['name'], $this->db) == FALSE) {
							//$gError->_error("Db::Open(): " . $this->_error());
							throw new Exception($this->_error());
							return 0;
						}
					} else {
						//$gError->_error("Db::Open(): Invalid config settings.");
						throw new Exception('Invalid config settings.');
						return 0;
					}
				break;
				case DB_PGSQL:
					if ( (is_array($gConfig)) && (isset($gConfig[$_db]['host'])) && 
						(isset($gConfig[$_db]['user'])) && (isset($gConfig[$_db]['pass'])) &&
						(isset($gConfig[$_db]['name'])) ) {

						$cstring = "host=" . $gConfig[$_db]['host'] . " dbname=" . $gConfig[$_db]['name'] .
									" user=" . $gConfig[$_db]['user'] . " password=" . $gConfig[$_db]['pass'];
							
						$this->db = @pg_connect($cstring);
						if ($this->db == FALSE) {
							//$gError->_error("Db::Open(): " . $this->_error());
							throw new Exception($this->_error());
							return 0;
						}
					} else {
						//$gError->_error("Db::Open(): Invalid config settings.");
						throw new Exception('Invalid config settings.');
						return 0;
					}
				break;
				case DB_SQLITE:
					if ( (is_array($gConfig)) && (isset($gConfig[$_db]['file'])) ) {
						
						//
						// Check if the file exists and we can read/write to it.
						//
						if ( (file_exists($gConfig[$_db]['file'])) &&
							( (!is_readable($gConfig[$_db]['file'])) || 
							(!is_writeable($gConfig[$_db]['file']))) ) {

							$gError->_error("Db::Open(): file: " . $gConfig[$_db]['file'] . 
								" exists but is not readable/writeable.");
							return 0;
						} else {		
							$error_message = '';
							$this->db = @sqlite_popen($gConfig[$_db]['file'], 0666, $error_message);
							if ($this->db == FALSE) {
								//$gError->_error("Db::Open(): " . $error_message);
								throw new Exception($error_message);
								return 0;
							}
						}
					} else {
						$gError->_error("Db::Open(): Invalid config settings.");
						throw new Exception('Invalid config settings.');
						return 0;
					}						
				break;
				default:
					$gError->_error("Db::Open(): Unknown database type id = " . $this->db_type);
					throw new Exception('Unknown database type id = ' . $this->db_type);
					return 0;
			}
		}

		$this->open = true;
		return 1;
	}

	//
	// Close a database Connection
	//
	function Close() {

		global $gError;

		if ($this->db) {

			$br = 1;

			switch($this->db_type) {
				case DB_MYSQL: $br = @mysql_close($this->db);	
					break;
				case DB_PGSQL: $br = @pg_close($this->db);
					break;
				case DB_SQLITE: $br = @sqlite_close($this->db);
					break;
				default:
					$gError->_error("Db::Close(): Unknown database type id = " . $this->db_type);
					return 0;
			}

			if (!$br) {
				$gError->_error("Db::Close(): " . $this->_error());
				return 0;
			}
		}

		$this->open = false;
		return 1;
	}	

	//
	// Excute a Query
	//
	function Query($query) {
		$this->count++;
		
		global $gError;

		//echo "<br/>QUERY: $query<br/>";
		//$query = str_replace ("'", "`", $query);

		switch($this->db_type) {
			case DB_MYSQL: $result = @mysql_query($query, $this->db);		
				break;
			case DB_PGSQL: $result = @pg_query($this->db, $query);
				break;
			case DB_SQLITE: $result = @sqlite_query($this->db, $query);
				break;
			default:
				$gError->_error("Db::Query(): Unknown database type id = " . $this->db_type);
				return 0;
		}

		if (!$result) {

			//
			// These error codes are skipped as global errors, as they are
			// often used to catch constraint violoations, but we'll want to
			// provide a good error message for these cases. The rest will
			// act as fatal errors, and exit the interface
			//
			switch($this->_error_code()) {
				case DB_ERROR_CONSTRAINT:
				case DB_ERROR_NOT_FOUND:
				case DB_ERROR_ALREADY_EXISTS:
					break;
				default:
					$gError->_error("Db::Query: failed to execute (query=$query) : ". $this->_error());
			}
			return 0;
		} 

		return $result;
	}

	//
	// Get the Number of Rows for a result set.
	//
	function NumRows($res_set) {
			
		global $gError;

		switch($this->db_type) {
			case DB_MYSQL:
				return @mysql_num_rows($res_set);
			case DB_PGSQL:
				return @pg_num_rows($res_set);
			case DB_SQLITE:
				return @sqlite_num_rows($res_set);
			default:
				$gError->_error("Db::NumRows(): Unknown database type id = " . $this->db_type);
				return NULL;
		}

		return NULL;
	}

	//
	// Fetch a row from a result set
	//
	function FetchRow($result) {
				
		global $gError;
		
		switch($this->db_type) {
			case DB_MYSQL:
				return @mysql_fetch_row($result);
			case DB_PGSQL:
				return @pg_fetch_row($result);
			case DB_SQLITE:
				return @sqlite_fetch_single($result);
			default:
				$gError->_error("Db::FetchRow(): Unknown database type id = " . $this->db_type);
				return NULL;
		}
	
		return NULL;
	}

	//
	// Fetch a array from a result set
	//
	function FetchAssoc($result) {
				
		global $gError;
		
		switch($this->db_type) {
			case DB_MYSQL:
				return @mysql_fetch_assoc($result);
			case DB_PGSQL:
				return @pg_fetch_assoc($result);
			case DB_SQLITE:
				return @sqlite_fetch_array($result);
			default:
				$gError->_error("Db::FetchArray(): Unknown database type id = " . $this->db_type);
				return NULL;
		}
	
		return NULL;
	}

	//
	// Free a Result Set
	//
	function FreeResult($result) {

		global $gError;

		switch($this->db_type) {
			case DB_MYSQL:
				return @mysql_free_result($result);
			case DB_PGSQL:
				return @pg_free_result($result);
			case DB_SQLITE:
				return 1; 
			default:
				$gError->_error("Db::FreeResult(): Unknown database type id = " . $this->db_type);
				return NULL;
		}
	
		return NULL;
	}

	//
	// Get the last result oid
	//
	function InsertId($result = NULL) {

		global $gError;

		switch($this->db_type) {
			case DB_MYSQL:
				return @mysql_insert_id($this->db);
			case DB_PGSQL:
				return @pg_last_oid($result);
			case DB_SQLITE:
				return @sqlite_last_insert_rowid($this->db);
			default:
				$gError->_error("Db::InsertId(): Unknown database type id = " . $this->db_type);
				return NULL;
		}

		return NULL;
	}

	//
	// Returns the number of affected rows from the
	// last insert, update or delete.
	//
	function Affected($result = NULL) {

		global $gError;

		switch($this->db_type) {
			case DB_MYSQL:
				return @mysql_affected_rows($this->db);
			case DB_PGSQL:
				return @pg_affected_rows($result);
			case DB_SQLITE:
				return 0; 
			default:
				$gError->_error("Db::Affected(): Unknown database type id = " . $this->db_type);
				return NULL;
		}

		return NULL;
	}

	//
	// Grabs the next sequence value for the given
	// sequence name.
	//
	function _id($_sequence_name) {

		global $gError;

		switch($this->db_type) {
			case DB_MYSQL: return -1;
			case DB_PGSQL:
				$res = $this->Query(sprintf("select nextval('%s')", $_sequence_name));
				list($id) = $this->FetchRow($res);
				$this->FreeResult($res);
				return $id;
			case DB_SQLITE: return -1; 
			default:
				$gError->_error("Db::_id(): Unknown database type id = " . $this->db_type);
				return NULL;
		}
	
		return NULL;
	}

	//
	// Returns true or false if the database connection
	// is open or not.
	//
	function Alive() {
		return $this->db ? 1 : 0;
	}

	//
	// Escapes a text string for database insertion
	//
	function escape($_string) {
		
		$_string = str_replace("'", "`", $_string);
		switch($this->db_type) {
			case DB_MYSQL:
				return addslashes(stripslashes($_string));
			case DB_PGSQL:
				return pg_escape_string(stripslashes($_string));
			case DB_SQLITE:
				return addslashes(stripslashes($_string));
			default:
				$gError->_error("Db::_id(): Unknown database type id = " . $this->db_type);
				return NULL;
		}

		return NULL;		
	}

	//
	// Returns the last error code
	//
	function _error_code() {
		switch($this->db_type) {
			case DB_MYSQL:
				 
				return DB_ERROR;
			break;
			case DB_PGSQL:

				$error_message = $this->_error();

				$error_regexps = array(
					'/(([Rr]elation|[Ss]equence|[Tt]able)( [\"\'].*[\"\'])? does not exist|[Cc]lass ".+" not found)$/'	=> DB_ERROR_NOSUCHTABLE,
					'/[Cc]olumn [\"\'].*[\"\'] does not exist/' => DB_ERROR_NOSUCHFIELD,
					'/[Rr]elation [\"\'].*[\"\'] already exists|[Cc]annot insert a duplicate key into (a )?unique index.*/' => DB_ERROR_ALREADY_EXISTS, 
					'/(divide|division) by zero$/'          => DB_ERROR_DIVZERO,
					'/pg_atoi: error in .*: can\'t parse /' => DB_ERROR_INVALID_NUMBER,
					'/invalid input syntax for integer/'    => DB_ERROR_INVALID_NUMBER,
					'/ttribute [\"\'].*[\"\'] not found$|[Rr]elation [\"\'].*[\"\'] does not have attribute [\"\'].*[\"\']/' => DB_ERROR_NOSUCHFIELD,
					'/parser: parse error at or near \"/'   => DB_ERROR_SYNTAX,
					'/syntax error at/'                     => DB_ERROR_SYNTAX,
					'/violates not-null constraint/'        => DB_ERROR_CONSTRAINT_NOT_NULL,
					'/violates [\w ]+ constraint/'          => DB_ERROR_CONSTRAINT,
					'/referential integrity violation/'     => DB_ERROR_CONSTRAINT
				);

				foreach ($error_regexps as $regexp => $code) {
					if (preg_match($regexp, $error_message)) {
						return $code;
					}
				}
			break;
			case DB_SQLITE:
				
				return DB_ERROR;
			break;
		}
	
		return DB_ERROR;
        }

	//
	// Returns the last error message
	//
	function _error() {

		switch($this->db_type) {
			case DB_MYSQL: return @mysql_error($this->db);
				break;
			case DB_PGSQL: return @pg_last_error($this->db);
				break;
			case DB_SQLITE: return @sqlite_error_string(@sqlite_last_error($this->db));
				break;
			default:
				return "Db::Query(): Unknown database type id = " . $this->db_type;
		}

		return NULL;
	}
};

?>
