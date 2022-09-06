package spiralMatrix;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class main {

	public int[][] matrix ;
	
	private void populateMatrix(int m, int n)
	{
		
		int value = 1;
		for(int i = 0 ; i < m;i++)
		{
			for(int z = 0; z < n; z++)
			{
				this.matrix[i][z] = value++;
				//System.out.println(this.matrix[i][z]);
			}
		}
	}
	public void print_spiral(int m, int n)
	{
		this.matrix = new int[m][n];
		populateMatrix(m,n);
		boolean _continue = true;		
		int going_right = 0;
		int going_down = 0;
		int going_back = n - 1;
		int going_up = m - 1 ;
		int result = m * n;
		int iterations = 0;
		int[] result_array = new int[result];		
		
	    do 
	    {
	    	
	    	for(int i = going_right; i <= going_back && iterations != result; i++)
	    	{
	    		result_array[iterations] = this.matrix[going_right][i];
	    		iterations++;
	    		
	    	}
	    	going_down++;
	    
	    	for(int z = going_down; z <= going_up && iterations != result; z++)
	    	{
	    		result_array[iterations] = this.matrix[z][(going_back)];
	    		iterations++;
	    	
	    	}	    	
	    	going_back--;
	    	
	    	
	    	for(int x = going_back; x >= going_right && iterations != result; x--)
	    	{	
	    		result_array[iterations] = this.matrix[going_up][x];
	    		iterations++;
	    		
	    	}
	    	going_up--;
	    	
	    	for(int y = going_up; y >= going_down && iterations != result; y--)
	    	{	
	    		result_array[iterations] = this.matrix[y][going_right];
	    		iterations++;
	    		
	    	}	    
	    	going_right++;   	
	    	
	    }while(!(iterations == result));
	    System.out.println(Arrays.toString(result_array));
		
	}
	
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println("-------------------4:4");
		(new main()).print_spiral(4,4);
		System.out.println("-------------------3:3");
		(new main()).print_spiral(3,3);
		System.out.println("-------------------5:4");
		(new main()).print_spiral(5,4);
		System.out.println("-------------------4:5");
		(new main()).print_spiral(4,5);
		System.out.println("-------------------6:4");
		(new main()).print_spiral(6,4);
		System.out.println("-------------------4:6");
		(new main()).print_spiral(4,6);
		System.out.println("-------------------3:6");
		(new main()).print_spiral(3,6);
		System.out.println("-------------------6:3");
		(new main()).print_spiral(6,3);
		int [] possible_moves = {1,4,2}; 
		System.out.println(print_result((new main()).win(1, possible_moves),1));
		System.out.println(print_result((new main()).win(2, possible_moves),2));
		System.out.println(print_result((new main()).win(3, possible_moves),3));
		System.out.println(print_result((new main()).win(4, possible_moves),4));
		System.out.println(print_result((new main()).win(5, possible_moves),5));
		System.out.println(print_result((new main()).win(6, possible_moves),6));
		System.out.println(print_result((new main()).win(7, possible_moves),7));
		System.out.println(print_result((new main()).win(8, possible_moves),8));
		System.out.println(print_result((new main()).win(9, possible_moves),9));
		
		
                   
	}
	private static String print_result(boolean win, int number_of_sticks)
	{
		if(win)
			return "n=:"+ number_of_sticks +" true - the player making the first move wins.";
		
		return "n="+ number_of_sticks + " false – the player making the first move loses.";
	}
	public boolean win(int number_of_sticks, int[] possible_moves)
	{
		//[1,4,2]
		//1[1,2][4,1][2,4]
		//2[4]   [2]  [1]		
		//1[4,2][2,1][1,4]
		//2[1]   [4]  [2]
		
		
		ArrayList<Integer> first_player_move = new ArrayList<Integer>();
		ArrayList<Integer> second_player_move = new ArrayList<Integer>();
		ArrayList<Integer> combinations_result = new ArrayList<Integer>();
		Integer[] boxedArray;
		ArrayList<Integer> remaning_moves;
		boolean game_complete = false;
		boolean start_game = true;
		int first_player_index = 0;
		int second_player_index = 0;
		int index = 0;
		int number = 0 ; 
		int combinations = 1;
		while(!game_complete)
		{	
			boxedArray = Arrays.stream(possible_moves).boxed().toArray(Integer[]::new);
			remaning_moves =  new ArrayList<Integer>(Arrays.asList(boxedArray));
			number = number_of_sticks;
			if(combinations == 3)
			{				
				 if(combinations_result.contains(1) ||combinations_result.contains(-2) )
					 return true;
				 else
					 return false;
			} 
			// clear arrays
			 first_player_move.clear();
			 second_player_move.clear();
			 combinations_result.clear();
			
			 //first player check if he can win with one move
			 for(int i = 0; i < remaning_moves.size();i++)
			 {
				 if(remaning_moves.get(i) - number == 0)
					 combinations_result.add(1);
			 }
			 if(combinations_result.contains(1))
				 return true;
			 //if he can't he is going to pick a value from remaning moves
			 //first player picks the first value
			 boolean first_pick_boolean = true;
			 index = first_player_index;
			 if(index >= remaning_moves.size())
				 index = 0;
			 int first_player_count_index = 0;
			 while(first_pick_boolean && remaning_moves.size() > 0)
			 {
				 if(remaning_moves.get(index) < number)
				 {
					 number -= remaning_moves.get(index);
					 first_player_move.add(remaning_moves.get(index));
					 remaning_moves.remove(index);
					 break;					 
				 }
				 if(remaning_moves.get(index) > number)
					 index++;
				 if(index >= remaning_moves.size())
					 index = 0;
				 if(remaning_moves.get(index) > number &&  first_player_count_index >= remaning_moves.size())
					 return false;
				 first_player_count_index++;
					 
			 }
			 first_player_index = index;
			  // second player chooses move
			 for(int i = 0; i < remaning_moves.size();i++)
			 {
				 if(remaning_moves.get(i) - number == 0)
					 combinations_result.add(2);
			 }
			 if(!combinations_result.contains(2))
			 {
				 //second player picks value
				 index = (second_player_index - 1 < 0 ? 0 : second_player_index - 1);
				 int second_player_count_index = 0;
				 while(first_pick_boolean && remaning_moves.size() > 0)
				 {
					 if(remaning_moves.get(index) < number)
					 {
						 number -= remaning_moves.get(index);
						 second_player_move.add(remaning_moves.get(index));
						 remaning_moves.remove(index);
						 break;					 
					 }
					 if(remaning_moves.get(index) > number)
						 index++;
					 if(remaning_moves.get(index) > number &&  second_player_count_index >= remaning_moves.size())
						 combinations_result.add(-2);
					 if(index >= remaning_moves.size())
						 index = 0;
					 second_player_count_index++;
						 
				 }
				 second_player_index = index;
				 // get the last value;
				 if(remaning_moves.size() > 0)
				 {
				    first_player_move.add(remaning_moves.get(remaning_moves.size() - 1));
				    remaning_moves.remove(remaning_moves.size() - 1);
				 }
				 
				 start_game = true;
				 while(start_game)
				 {
					 // first player move checks if he wins 
					 for(int i = 0; i < first_player_move.size();i++)
					 {
						 if(first_player_move.get(i) - number == 0)
							 return true;
					 }
					//first player did not win with move chooses index
					 index = (first_player_index - 1 < 0 ? 0 :first_player_index - 1) ;
					 for(int i = 0; i < first_player_move.size();i++)
					 {
						 if(first_player_move.get(index) < number)
						 {
							 number -= first_player_move.get(index);						 
							 break;					 
						 }
						 else if(first_player_move.get(index) > number)
						 {
							 combinations_result.add(-1);
							 break;
						 }
					 }
					 //second player moves
					 if(second_player_move.get(second_player_move.size()- 1) - number == 0)
					 {
						 combinations_result.add(2);
						 break;
					 }
					 else if(second_player_move.get(second_player_move.size()- 1) < number)
					 {
						 number -= second_player_move.get(second_player_move.size()- 1);					 					 
					 }
					 else if(second_player_move.get(second_player_move.size()- 1) > number)
					 {
						 combinations_result.add(-2);
						 break;
					 }				 					
					 
				 }
			 }
			 ++first_player_index;
			 if(first_player_index >= possible_moves.length)
				 first_player_index = 0;
			 
			 second_player_index = first_player_index;
			 ++second_player_index;
			 if(second_player_index >= possible_moves.length)
				 second_player_index = 0;
			 combinations++;
			 if(combinations_result.contains(1) ||combinations_result.contains(-2) )
				 return true;
			 
			 
		}		
 		    			
				
		return true;
	}


}
