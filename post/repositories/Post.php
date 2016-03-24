<?php

namespace deco\extensions\post\repositories;

class Post extends \deco\essentials\prototypes\table\Table {
 
  /**
  * @type integer
   * @references table: User; column: id; onUpdate: cascade; onDelete: cascade;  
  * @index true
   */
  protected $ownerId;
  
  /**   
  * @type string
  * @validation minLength: 1; maxLength: 100     
   */
  
  protected $title;  
  
  /**   
  * @type string  
  * @lazy true
  * @default NULL
   */
  protected $content;
  
  /**
  * @type timestamp   
  * @default CURRENT_TIMESTAMP   
  * @set false
   */
  protected $created;    
  
  /**
  * @type timestamp   
  * @default CURRENT_TIMESTAMP   
  * @onUpdate URRENT_TIMESTAMP
  * @set false
   */
  protected $modified;

  public function setCreatedToNow(){
    $table = self::getTable();
    self::db()->execute("UPDATE $table SET created = CURRENT_TIMESTAMP WHERE id = {$this->getId()}");    
    return $this;
  }
  
}
