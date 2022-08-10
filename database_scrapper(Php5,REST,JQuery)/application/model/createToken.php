<?php


/**file createToken.php
 * 
 * the class creates and retruns a random token 
 * 
 *
 * @author thomas
 */
class createToken {

    //put your code here
    public static $tokenFetch;
    public static $tokenAjax;

    public static function setRandomTokenFetch($length) {
        $validCharacters = "ABCDEFGHIJKLMNPQRSTUXYVWZabcdefghijlmnopqrstuxyvwz0123456789";
        $validCharNumber = strlen($validCharacters);
        $result = "";

        for ($i = 0; $i < $length; $i++) {
            $index = mt_rand(0, $validCharNumber - 1);
            $result .= $validCharacters[$index];
        }

        self::$tokenFetch = $result;
    }

    public static function setRandomTokenAjax($length) {
        $validCharacters = "ABCDEFGHIJKLMNPQRSTUXYVWZabcdefghijlmnopqrstuxyvwz0123456789";
        $validCharNumber = strlen($validCharacters);
        $result = "";

        for ($i = 0; $i < $length; $i++) {
            $index = mt_rand(0, $validCharNumber - 1);
            $result .= $validCharacters[$index];
        }

        self::$tokenAjax = $result;
    }

    public static function getRandomTokenFetch() {


        return self::$tokenFetch;
    }

    public static function getRandomTokenAjax() {


        return self::$tokenAjax;
    }

}
