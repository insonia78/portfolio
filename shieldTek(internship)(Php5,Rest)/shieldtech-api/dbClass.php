<?php

	
/* 
 * SHIELDtech Alert API
 * v0.8.4
 * For use with mobile application
 * 
 * See documentation for full details
 * https://docs.google.com/document/d/1VUBmMxiK6zx31Fj6eMEQdZ2GGZrsHhaczWTDZxp8kqw/
 *
 *
 */

	class Database
	{
		private $link;
		private $res; //mysqli_result object
		private $host = "localhost"; // change to your own default values
		private $user = "root"; // change to your own default values
		private $pass = "thomas78"; // change to your own default values
		private $db = "DATABASE_NAME";
                private $stmt; //For use with prepared statements
                private $var;

		// connects to database.
		public function setup()
		{
			if (isset($this->link))
				$this->disconnect();
			$this->connect();
		}
		
		// sets user, pass and host and connects to custom credentials
		public function setup_custom($u, $p, $h, $db)
		{
			$this->user = $u;
			$this->pass = $p;
			$this->host = $h;
			$this->db = $db;
			if (isset($this->link))
				$this->disconnect();
			$this->connect();
		}

		// Changes the database in which all queries will be performed
		public function pick_db($db)
		{
			$this->db = $db;
		}

		// destructor disconnects and frees the results holder
		public function __destruct()
		{
			$this->disconnect();
		}

		//Closes the connection to the DB
		public function disconnect()
		{
			if (isset($this->link))
				mysqli_close($this->link);
			unset($this->link);
		}
	

		// connects to the DB or disconnects/reconnects if a connection already existed
		public function connect()
		{
			if (isset($this->link))
				$this->disconnect();
			else
			{
				try {
                                    $this->link=mysqli_connect($this->host, $this->user, $this->pass, $this->db);
					if (mysqli_connect_errno($this->link))
						throw new Exception("Cannot Connect to ".$this->host);
				} catch (Exception $e)
				{
					echo $e->getMessage();
					exit;
				}
			}
		}

                
		public function send_sql($sql) {
		$i = 0 ;	
                    if (!isset($this->link))
				$this->connect();
			try {
				if (! $this->res = mysqli_query($this->link, $sql))
                                       
					throw new Exception("Could not send SQL query");
			} catch (Exception $e)
			{
				echo $e->getMessage()."<BR>";
				echo mysqli_error($this->link);
				exit;
			}
			return $this->res;
		}
                
                //Sets up a prepared statement with Mysqli
                //Input: SQL statement, using '?' for unknown inputs
                //Returns: The Mysqli statement object for you to use in our own mysqli_stmt_bind_param
                public function prepare($sql)
                {
                    if (!isset($this->link))
				$this->connect();
			try {
				if (! $this->stmt = mysqli_prepare($this->link, $sql))
					throw new Exception("Could not prepare SQL statement");
			} catch (Exception $e)
			{
				echo $e->getMessage()."<BR>";
				echo mysqli_error($this->link);
				exit;
			}
			return $this->stmt;
                }
                
                //Binds and executes prepared statement using inputted values
                //Input: String with types of IDs being inserted, must have fields.
                //UPDATE: It is recommended to not use this function. Use the returned stmt from prepare() and submit
                //your own mysqli_stmt_bind_param
                public function bindExec($types,$id1, $id2)
                {
                    
                    try 
                    {
                        if (!isset($this->link))
                            throw new Exception ("Error binding prepared statement. Not connected to DB.");
                        if (!isset($this->stmt))
                            throw new Exception ("Error binding prepared statement. Statement not initialized.");
                        if (! mysqli_stmt_bind_param($this->stmt, $types, $id1, $id2))
                            throw new Exception("Could not bind SQL query with IDs.");
                        if (! mysqli_stmt_execute($this->stmt))
                            throw new Exception("Could not execute SQL query.");
                        mysqli_stmt_close($this->stmt);

                    } 
                   catch (Exception $e)
                    {
                            echo $e->getMessage()."<BR>";
                            echo mysqli_error($this->link);
                            exit;
                    }
                    
                }

                
		// Shows the contents of the $res as a table
		public function printout() {
			if (isset($this->res) && (mysqli_num_rows($this->res) > 0))
			{
				mysqli_data_seek($this->res, 0);
				$num=mysqli_num_fields($this->res);
				echo "<table border=1>";
				echo "<tr>";
				for ($i=0;$i<$num;$i++){
				   echo "<th>";
				   echo mysqli_fetch_field_direct($this->res,$i);
				   echo "</th>";
				}
				echo "</tr>";
				while ($row  =  mysqli_fetch_row($this->res)) {
					echo "<tr>";
					foreach ($row as $elem) {
					   echo "<td>$elem</td>";
					}
					echo "</tr>";
				}
				echo "</table>";
			}
			else
				echo "There is nothing to print!<BR>";
		}

		// returns an array with the next row
		public function next_row()
		{
			if (isset($this->res))
				return mysqli_fetch_row($this->res);
			
                        echo "You need to make a query first!!!";
			return false;
		}

		// returns the last AUTO_INCREMENT data created
		public function insert_id()
		{
			if (isset($this->link))
			{
				$id = mysqli_insert_id($this->link);
				if ($id == 0)
					echo "You did not insert an element that caused an auto-increment ID to be created!<BR>";
				return $id;
			}
			echo "You are not connected to the database!";
			return false;
		}

		// Creates a new DB and selects it
		public function new_db($name)
		{
			if (!isset($this->link))
				$this->connect();
			$query = "CREATE DATABASE IF NOT EXISTS ".$name;
			try {
				if (!mysqli_query($this->link, $query))
					throw new Exception("Cannot create database ".$name);
				$this->db = $name;
			} catch (Exception $e)
			{
				echo $e->getMessage()."<BR>";
				echo mysqli_error($this->link);
				exit;
			}
		}
                public function getRow($sql)
                {  
                    echo'<style>
                      .error{
                           color:red;
                           }
                           </style>';
                    
                  if (!isset($this->link))
				$this->connect();
			try {
                                                 
			    if ($this->var = mysqli_num_rows($sql))
                            {}else{echo'<p class="error">An Error has Accour. Contact the Administrator.</p>';}
                                                                    
                                       
			} catch (Exception $e)
			{
				echo $e->getMessage()."<BR>";
				echo mysqli_error($this->link);
				exit;
			}
			return $this->var;
                }
                 public function sendEmail($token,$email)
                {  
                    
                  if (!isset($this->link))
				$this->connect();
			try {
                                                 
                            $subject = 'your momentary password';
                             $message = ' This is your momentary password in other to reset your password ' . $token;
                             if (mail($email, $subject, $message)) {
                                 echo '<p>email sendt</p>';
                                 require('resettoken.php');
                               }
                           } catch (Exception $e)
			    {
				echo $e->getMessage()."<BR>";
				echo mysqli_error($this->link);
				exit;
			}
			
                }
               
                
	}

?>