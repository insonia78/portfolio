<?php

/*
 * file DBClass.php
 * @Author:Thomas Zangari
 * @date: 1/11/2016
 * 
 * class that process all database conections and some opeartions 
 * requires ../config/config.php to inizialize the data ;
 * 
 * 
 */
     
     

     
	class Database 
	{
		private $link ;
		private $res; //mysqli_result object
		private $host ; // change to your own default values
		private $user ; // change to your own default values
		private $pass ; // change to your own default values
		private $db ;
                private $stmt; //For use with prepared statements
                private $var;
                private $url;
                  
                
                function __construct() {
                     
                    
                                       
                       include '../config/config.php';
                    
                   
                     
                     
                    $this->db = $__DATABASE['database'];
                    $this->pass = $__DATABASE['pw'];
                    $this->user = $__DATABASE['user'] ;
                    $this->host = $__DATABASE['host'];
                    $this->url = $__URL;
                    
                      
                  }             
                 public function getUrl()
                 {
                     return $this->url;
                     
                 }
                    
                   
                
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
                        echo "$this->link ".$this->link;
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
                
                public function bindExec($types,$id1)
                {
                    
                    try 
                    {
                        if (!isset($this->link))
                            throw new Exception ("Error binding prepared statement. Not connected to DB.");
                        if (!isset($this->stmt))
                            throw new Exception ("Error binding prepared statement. Statement not initialized.");
                        if (! mysqli_stmt_bind_param($this->stmt, $types, $id1))
                            throw new Exception("Could not bind SQL query with IDs.");
                        if (! mysqli_stmt_execute($this->stmt))
                            throw new Exception("Could not execute SQL query.");
                        if(!($result = mysqli_stmt_get_result($this->stmt)))
                                throw new Exception("Could not execute SQL query.");
                        
                        mysqli_stmt_close($this->stmt);
                        return $result;

                    } 
                   catch (Exception $e)
                    {
                            echo $e->getMessage()."<BR>";
                            echo mysqli_error($this->link);
                            exit;
                    }
                    
                }

                
		
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
                
               
                
	}

?>
